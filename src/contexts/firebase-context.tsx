import { auth, analytics } from '../services/firebase';
import { createContext, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface FirebaseContextValue {
  auth: typeof auth;
  analytics: typeof analytics;
}

export const FirebaseContext = createContext<FirebaseContextValue>({} as FirebaseContextValue);

export const FirebaseProvider = ({ children }: Props) => {
  const value: FirebaseContextValue = {
    auth,
    analytics,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
