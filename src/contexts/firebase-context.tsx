import { auth, analytics, firestore } from '../services/firebase';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserService from '../services/user.service';
import useUserStore from '../stores/userStore';

interface FirebaseContextProps {
  children?: ReactNode;
}

interface FirebaseContextValue {
  auth: typeof auth;
  analytics: typeof analytics;
  firestore: typeof firestore;
}

export const FirebaseContext = createContext<FirebaseContextValue>({} as FirebaseContextValue);

export default function FirebaseProvider({ children }: FirebaseContextProps) {
  const [user] = useAuthState(auth);
  const userStore = useUserStore();

  useEffect(() => {
    if (user) {
      retrieveUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retrieveUser = async (user: any) => {
    const newUser = await UserService.getUser(firestore, user.uid);

    if (typeof newUser !== 'string' && user.emailVerified) {
      userStore.login(newUser);
    }
  };

  const value: FirebaseContextValue = {
    auth,
    analytics,
    firestore,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
