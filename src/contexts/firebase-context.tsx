import { auth, firestore } from '../services/firebase';
import { createContext, ReactNode } from 'react';
// import { createContext, ReactNode, useEffect, useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import UserService from '../services/user.service';
// import { UserAtom } from '../stores/userStore';
// import { useSetAtom } from 'jotai';
// import { useToast } from '@/components/ui/use-toast';
// import { ReloadIcon } from '@radix-ui/react-icons';

interface FirebaseContextProps {
  children?: ReactNode;
}

interface FirebaseContextValue {
  auth: typeof auth;
  firestore: typeof firestore;
}

export const FirebaseContext = createContext<FirebaseContextValue>({} as FirebaseContextValue);

export default function FirebaseProvider({ children }: FirebaseContextProps) {
  // const [user, loading] = useAuthState(auth);
  // const setUserAtom = useSetAtom(UserAtom);
  // const [isUserRetrieved, setIsUserRetrieved] = useState(false);
  // const { toast } = useToast();

  // useEffect(() => {
  //   if (!loading) {
  //     setUserAtom(null);

  //     if (user) {
  //       retrieveUser(user);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loading]);

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const retrieveUser = async (user: any) => {
  //   const newUser = await UserService.getUser(firestore, user.uid);

  //   if (newUser && typeof newUser !== 'string' && user.emailVerified) {
  //     setUserAtom(newUser);
  //   } else if (
  //     newUser &&
  //     typeof newUser !== 'string' &&
  //     !user.emailVerified &&
  //     !window.location.href.includes('auth')
  //   ) {
  //     toast({
  //       title: 'Please verify your email first',
  //     });
  //     window.location.href = '/auth';
  //   } else if (!window.location.href.includes('auth')) {
  //     window.location.href = '/auth';
  //   }

  //   setIsUserRetrieved(true);
  // };

  const value: FirebaseContextValue = {
    auth,
    firestore,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {/* {isUserRetrieved ? (
        children
      ) : (
        <div className="w-full h-full flex items-center content-center justify-center">
          <ReloadIcon className="mr-2 h-7 w-7 animate-spin" />
        </div>
      )} */}
      {children}
    </FirebaseContext.Provider>
  );
}
