import { auth, analytics, firestore } from '../services/firebase';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserService from '../services/user.service';
import RecipeService from '../services/recipe.service';
import { User } from '../types/user';
import IpAddressService from '../services/ipAddress.service';
import { getCurrentDate, isOneMonthAfter } from '../utils/date';
import { UserAtom } from '../stores/userStore';
import { RecipesAtom } from '../stores/recipesStore';
import { useSetAtom } from 'jotai';
import { TempUserAtom } from '../stores/tempUserStore';
import { LoadingAtom } from '../stores/loadingStore';

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
  const setUserAtom = useSetAtom(UserAtom);
  const setRecipes = useSetAtom(RecipesAtom);
  const setTempUser = useSetAtom(TempUserAtom);
  const setLoadingLog = useSetAtom(LoadingAtom);

  useEffect(() => {
    setLoadingLog(true);

    if (!loading) {
      setRecipes([]);
      setUserAtom(null);
      setTempUser(null);

      if (user) {
        retrieveUser(user);
      } else {
        retrieveTempUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const retrieveTempUser = async () => {
    await IpAddressService.retrieveTempUser(firestore, setTempUser);
    setLoadingLog(false);
  };

  const retrieveRecipes = async (user: User) => {
    const recipes = await RecipeService.getRecipes(firestore, user);
    setRecipes(recipes);
  };

  const checkIf1MonthLaterAndRenew = async (user: User) => {
    if (user) {
      const shouldRenewThePlan = isOneMonthAfter(getCurrentDate(), user!.planRenewalDate);
      if (shouldRenewThePlan) {
        const userCopy = structuredClone(user);
        userCopy!.planRenewalDate = getCurrentDate();
        userCopy.recipesGenerated - 0;

        if (!userCopy!.renewed) {
          userCopy.premium = false;
        }

        UserService.updateUser(firestore, userCopy as User, setUserAtom);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retrieveUser = async (user: any) => {
    const newUser = await UserService.getUser(firestore, user.uid);

    if (typeof newUser !== 'string' && user.emailVerified) {
      setUserAtom(newUser);
      setLoadingLog(false);
      retrieveRecipes(newUser);
      await checkIf1MonthLaterAndRenew(newUser);
    }
  };

  const value: FirebaseContextValue = {
    auth,
    analytics,
    firestore,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
