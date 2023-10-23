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
import { UserActions } from '../stores/userStore';
import { getCurrentDate } from '../utils/date';

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

const updateUser = async (firestore: Firestore, updatedUser: User, userStore: UserActions): Promise<User | string> => {
  if (updatedUser.id) {
    const usersRef = doc(firestore, collectionRef, updatedUser.id);

    const userCopy = structuredClone(updatedUser);
    delete userCopy.id;
    await updateDoc(usersRef, userCopy);
    userStore.update(updatedUser);
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
      } as User;
      delete user.password;

      await setDoc(doc(firestore, collectionRef, userCredentials.user.uid), user);
      await sendEmailVerification(userCredentials.user);
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
  userStore: UserActions,
  errorHandling: (_error: string) => void,
  successHandling: (_success: string, _redirect: boolean, _redirectDestiny?: string) => void,
  redirectDestiny: string,
) => {
  signInWithEmailAndPassword(auth, attemptedUser.email, attemptedUser.password)
    .then(async (userCredentials) => {
      if (userCredentials.user.emailVerified) {
        userStore.startLoggingIn();
        const user = await UserService.getUser(firestore, userCredentials.user.uid);

        if (typeof user !== 'string') {
          user.id = userCredentials.user.uid;
          userStore.update(user);

          successHandling('Login successfull!', true, redirectDestiny);
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
  userStore: UserActions,
  errorHandling: (_error: string) => void,
  successHandling: (_success: string, _redirect: boolean, _redirectDestiny?: string) => void,
  redirectDestiny: string,
) => {
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const userCredentials = result.user;
        userStore.startLoggingIn();

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
          } as User;

          await setDoc(doc(firestore, collectionRef, userCredentials.uid), user); // change!

          user.id = userCredentials.uid;
        }

        userStore.update(user as User);

        successHandling('Login successfull!', true, redirectDestiny);
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

const UserService = {
  getUser,
  getUserByEmail,
  updateUser,
  signUp,
  login,
  googleLogin,
  authErrorHandling,
};

export default UserService;
