import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { User, UserLogin } from '../types/user';
import { FirebaseError } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getCurrentDate } from '../utils/date';
import MailchimpService from './mailchimp.service';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const authType = getAuth();
const collectionRef = 'users';

const getUser = async (firestore: Firestore, userId: string): Promise<User | string> => {
  const usersRef = doc(firestore, collectionRef, userId);
  const userSnap = await getDoc(usersRef);

  if (userSnap.exists()) {
    const user = userSnap.data() as User;
    user.id = userSnap.id;
    return user;
  } else {
    return "This user doesn't exist";
  }
};

const getUserByEmail = async (firestore: Firestore, userEmail: string): Promise<User | string> => {
  const usersRef = collection(firestore, collectionRef);
  const q = query(usersRef, where('email', '==', userEmail));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const user = querySnapshot.docs[0].data() as User;
    user.id = querySnapshot.docs[0].id;
    return user;
  } else {
    return "This user doesn't exist";
  }
};

const updateUser = async (
  firestore: Firestore,
  updatedUser: User,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
): Promise<User | string> => {
  if (updatedUser.id) {
    const usersRef = doc(firestore, collectionRef, updatedUser.id);

    const userCopy = structuredClone(updatedUser);
    delete userCopy.id;
    await updateDoc(usersRef, userCopy);
    delete userCopy.customerId;
    setUser(updatedUser);
  }

  return 'No user provided';
};

const signUp = async (
  auth: typeof authType,
  firestore: Firestore,
  newUser: UserLogin,
  errorHandling: (_error: string) => void,
  successHandling: (_success: string, _redirect: boolean) => void,
) => {
  createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
    .then(async (userCredentials) => {
      const user = {
        ...newUser,
        recipes: [],
        recipesGenerated: 0,
        planRenewalDate: getCurrentDate(),
        premium: false,
        profileImage: '',
      } as User;
      delete user.password;

      await setDoc(doc(firestore, collectionRef, userCredentials.user.uid), user);
      await sendEmailVerification(userCredentials.user);
      await MailchimpService.setMailchimp(user);
      successHandling('Sign up successfull! Now, enter your email and verify your account', false);
    })
    .catch((err) => {
      errorHandling(UserService.authErrorHandling(err));
    });
};

const login = async (
  auth: typeof authType,
  firestore: Firestore,
  attemptedUser: UserLogin,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoadingLog: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandling: (_error: string) => void,
  successHandling: (_success: string, _redirect: boolean, _redirectDestiny?: string) => void,
  retrieveRecipes: (_user: User) => void,
) => {
  signInWithEmailAndPassword(auth, attemptedUser.email, attemptedUser.password)
    .then(async (userCredentials) => {
      if (userCredentials.user.emailVerified) {
        setLoadingLog(true);
        const user = await UserService.getUser(firestore, userCredentials.user.uid);

        if (typeof user !== 'string') {
          user.id = userCredentials.user.uid;
          setUser(user);
          await retrieveRecipes(user as User);
          setLoadingLog(false);

          successHandling('Login successfull!', true);
        }
      } else {
        errorHandling('Please validate your email before continuing');
      }
    })
    .catch((err) => {
      errorHandling(UserService.authErrorHandling(err));
    });
};

const googleLogin = (
  auth: typeof authType,
  firestore: Firestore,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setLoadingLog: React.Dispatch<React.SetStateAction<boolean>>,
  errorHandling: (_error: string) => void,
  successHandling: (_success: string, _redirect: boolean, _redirectDestiny?: string) => void,
  retrieveRecipes: (_user: User) => void,
) => {
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const userCredentials = result.user;
        setLoadingLog(true);

        const existingUser = await getUser(firestore, userCredentials.uid);
        let user = existingUser;

        if (typeof existingUser === 'string') {
          user = {
            name: userCredentials.displayName,
            email: userCredentials.email,
            recipes: [],
            recipesGenerated: 0,
            planRenewalDate: getCurrentDate(),
            premium: false,
            profileImage: '',
          } as User;

          await setDoc(doc(firestore, collectionRef, userCredentials.uid), user);
          await MailchimpService.setMailchimp(user);

          user.id = userCredentials.uid;
        }

        setUser(user as User);
        await retrieveRecipes(user as User);
        setLoadingLog(false);

        successHandling('Login successfull!', true);
      }
    })
    .catch((err) => {
      errorHandling(UserService.authErrorHandling(err));
    });
};

const authErrorHandling = (err: FirebaseError) => {
  let errorMessage = '';

  switch (err.code) {
    case 'auth/invalid-login-credentials':
      errorMessage = 'Invalid credentials. Please check your email and password.';
      break;
    case 'auth/user-not-found':
      errorMessage = 'User not found. Please check your credentials or sign up if you are a new user.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many login attempts. Please try again later or reset your password.';
      break;
    case 'auth/operation-not-allowed':
      errorMessage = 'Operation not allowed. Please contact support for assistance.';
      break;
    case 'auth/email-already-exists':
      errorMessage =
        'Email already in use. Please use a different email address or reset your password if you forgot it.';
      break;
    default:
      errorMessage = 'An unknown error occurred';
  }
  return errorMessage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadNewPicture = async (storage: any, file: File | Blob) => {
  const newProfilePicRef = ref(storage, `profilePics/${uuidv4()}`);

  const upload = await uploadBytes(newProfilePicRef, file);
  return getDownloadURL(upload.ref);
};

const UserService = {
  getUser,
  getUserByEmail,
  updateUser,
  signUp,
  login,
  googleLogin,
  authErrorHandling,
  uploadNewPicture,
};

export default UserService;
