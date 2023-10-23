import { auth, analytics, firestore } from '../services/firebase';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserService from '../services/user.service';
import useUserStore from '../stores/userStore';
import useRecipesStore from '../stores/recipesStore';
import RecipeService from '../services/recipe.service';
import { User } from '../types/user';

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
  const recipeStore = useRecipesStore();

  useEffect(() => {
    if (!loading) {
      recipeStore.logout();
      if (user) {
        retrieveUser(user);
      } else {
        userStore.logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
