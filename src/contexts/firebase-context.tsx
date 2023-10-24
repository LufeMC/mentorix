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
import { getCurrentDate, isOneMonthAfter } from '../utils/date';

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
      recipeStore.recipes = [];
      userStore.user = null;

      if (user) {
        tempStore.tempUser = null;
        tempStore.tempDoneLoggingIn();
        retrieveUser(user);
      } else {
        userStore.stopLoggingIn();
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

  const checkIf1MonthLater = async (user: User) => {
    if (user) {
      const shouldRenewThePlan = isOneMonthAfter(getCurrentDate(), user!.planRenewalDate);
      if (shouldRenewThePlan) {
        const userCopy = structuredClone(user);
        userCopy!.planRenewalDate = getCurrentDate();

        if (!userCopy!.customerId) {
          userCopy.premium = false;
        }

        UserService.updateUser(firestore, userCopy as User, userStore);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retrieveUser = async (user: any) => {
    userStore.startLoggingIn();
    const newUser = await UserService.getUser(firestore, user.uid);

    if (typeof newUser !== 'string' && user.emailVerified) {
      userStore.update(newUser);
      userStore.stopLoggingIn();
      retrieveRecipes(newUser);
      await checkIf1MonthLater(newUser);
    }
  };

  const value: FirebaseContextValue = {
    auth,
    analytics,
    firestore,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
