import { auth, analytics, firestore } from '../services/firebase';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserService from '../services/user.service';
import useUserStore from '../stores/userStore';
import useRecipesStore from '../stores/recipesStore';
import RecipeService from '../services/recipe.service';
import { User } from '../types/user';
import IpAddressService from '../services/ipAddress.service';
import useTempUserStore from '../stores/tempUserStore';

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
  const [user, loading] = useAuthState(auth);
  const userStore = useUserStore();
  const tempStore = useTempUserStore();
  const recipeStore = useRecipesStore();

  useEffect(() => {
    userStore.startLoggingIn();
    tempStore.tempStartLoggingIn();
    if (!loading) {
      recipeStore.logout();
      if (user) {
        retrieveUser(user);
        tempStore.tempLogout();
      } else {
        userStore.logout();
        retrieveTempUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const retrieveTempUser = async () => {
    await IpAddressService.retrieveTempUser(firestore, tempStore);
  };

  const retrieveRecipes = async (user: User) => {
    const recipes = await RecipeService.getRecipes(firestore, user);
    recipeStore.changeRecipes(recipes);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retrieveUser = async (user: any) => {
    if (!userStore.user) {
      userStore.startLoggingIn();
      const newUser = await UserService.getUser(firestore, user.uid);

      if (typeof newUser !== 'string' && user.emailVerified) {
        userStore.update(newUser);
        retrieveRecipes(newUser);
      }
    } else {
      retrieveRecipes(userStore.user);
    }
  };

  const value: FirebaseContextValue = {
    auth,
    analytics,
    firestore,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
