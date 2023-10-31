import { auth, analytics, firestore, storage } from '../services/firebase';
import { createContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserService from '../services/user.service';
import RecipeService from '../services/recipe.service';
import { User } from '../types/user';
import { getCurrentDate, isOneMonthAfter } from '../utils/date';
import { UserAtom } from '../stores/userStore';
import {
  CommunityRecipesAtom,
  IsThereMoreCommunityRecipesAtom,
  IsThereMoreRecipesAtom,
  LastCommunityRecipeSnapshotAtom,
  RecipesAtom,
  TodayCommunityRecipesAtom,
} from '../stores/recipesStore';
import { useAtom, useSetAtom } from 'jotai';
import { LoadingAtom } from '../stores/loadingStore';
import MailchimpService from '../services/mailchimp.service';

interface FirebaseContextProps {
  children?: ReactNode;
}

interface FirebaseContextValue {
  auth: typeof auth;
  analytics: typeof analytics;
  firestore: typeof firestore;
  storage: typeof storage;
  retrieveRecipes: (_user: User) => void;
}

export const FirebaseContext = createContext<FirebaseContextValue>({} as FirebaseContextValue);

export default function FirebaseProvider({ children }: FirebaseContextProps) {
  const [user, loading] = useAuthState(auth);
  const setUserAtom = useSetAtom(UserAtom);
  const [recipesAtom, setRecipes] = useAtom(RecipesAtom);
  const setMoreRecipes = useSetAtom(IsThereMoreRecipesAtom);
  const [communityRecipesAtom, setCommunityRecipes] = useAtom(CommunityRecipesAtom);
  const [lastCommunityRecipeSnapshot, setLastCommunityRecipeSnapshot] = useAtom(LastCommunityRecipeSnapshotAtom);
  const setMoreCommunityRecipes = useSetAtom(IsThereMoreCommunityRecipesAtom);
  const setTodayCommunityRecipes = useSetAtom(TodayCommunityRecipesAtom);
  const setLoadingLog = useSetAtom(LoadingAtom);

  useEffect(() => {
    setLoadingLog(true);

    if (!loading) {
      setRecipes([]);
      setUserAtom(null);

      if (user) {
        retrieveUser(user);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const retrieveRecipes = async (user: User) => {
    const recipes = await RecipeService.getRecipes(firestore, user);
    const communityRecipesObj = await RecipeService.getCommunityRecipes(firestore, 1, lastCommunityRecipeSnapshot);
    setLastCommunityRecipeSnapshot(communityRecipesObj.newSnapshot);
    setRecipes([...recipesAtom, ...recipes.slice(0, recipes.length > 12 ? recipes.length - 1 : recipes.length)]);
    setMoreRecipes(recipes.length > 12);

    setCommunityRecipes([
      ...communityRecipesAtom,
      ...communityRecipesObj.communityRecipes.slice(
        0,
        communityRecipesObj.communityRecipes.length > 12
          ? communityRecipesObj.communityRecipes.length - 1
          : communityRecipesObj.communityRecipes.length,
      ),
    ]);
    setMoreCommunityRecipes(communityRecipesObj.communityRecipes.length > 12);

    if (communityRecipesObj.todayCommunityRecipes) {
      setTodayCommunityRecipes(communityRecipesObj.todayCommunityRecipes);
    }
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

          await MailchimpService.setMailchimp(userCopy);
        }

        UserService.updateUser(firestore, userCopy as User, setUserAtom);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retrieveUser = async (user: any) => {
    const newUser = await UserService.getUser(firestore, user.uid);

    if (newUser && typeof newUser !== 'string' && user.emailVerified) {
      await retrieveRecipes(newUser);
      setUserAtom(newUser);
      setLoadingLog(false);
      await checkIf1MonthLaterAndRenew(newUser);
    }
  };

  const value: FirebaseContextValue = {
    auth,
    analytics,
    firestore,
    storage,
    retrieveRecipes,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}
