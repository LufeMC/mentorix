import { useNavigate } from 'react-router-dom';
import {
  CommunityRecipesAtom,
  IsThereMoreCommunityRecipesAtom,
  LastCommunityRecipeSnapshotAtom,
  TodayCommunityRecipesAtom,
} from '../../../stores/recipesStore';
import { UserAtom } from '../../../stores/userStore';
import styles from './CommunityPage.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { logEvent } from 'firebase/analytics';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import RecipeCard from '../../../components/recipeCard/RecipeCard';
import { CurrentPageAtom, LoadingAtom } from '../../../stores/loadingStore';
import Button from '../../../components/button/Button';
import ChefBro from '../../../assets/img/Chef-bro.svg';
import { AiOutlinePlus } from 'react-icons/ai';
import { GiSandsOfTime } from 'react-icons/gi';
import RecipeService from '../../../services/recipe.service';
import TextButton from '../../../components/button/textButton/TextButton';
import RecipeCardShimmer from '../../../components/recipeCardShimmer/RecipeCardShimmer';

export default function CommunityPage() {
  const userAtom = useAtomValue(UserAtom);
  const [communityRecipes, setCommunityRecipes] = useAtom(CommunityRecipesAtom);
  const [isThereMoreCommunityRecipes, setIsThereMoreCommunityRecipes] = useAtom(IsThereMoreCommunityRecipesAtom);
  const [lastCommunityRecipeSnapshot, setLastCommunityRecipeSnapshot] = useAtom(LastCommunityRecipeSnapshotAtom);
  const todayCommunityRecipes = useAtomValue(TodayCommunityRecipesAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const logging = useRef<boolean>(false);

  const [isLoadingMoreCommunityRecipes, setIsLoadingMoreCommunityRecipes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !loadingLog) {
      if (!user && !userAtom) {
        navigate('/');
      }

      setCurrentPage('community');

      if (!logging.current) {
        logging.current = true;
        logEvent(firebaseContext.analytics, 'recipes_page_open');
        logging.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingLog]);

  const loadMoreCommunityRecipes = async () => {
    if (!isLoadingMoreCommunityRecipes) {
      setIsLoadingMoreCommunityRecipes(true);
      const communityRecipesObj = await RecipeService.getCommunityRecipes(
        firebaseContext.firestore,
        2,
        lastCommunityRecipeSnapshot,
      );
      setLastCommunityRecipeSnapshot(communityRecipesObj.newSnapshot);

      setCommunityRecipes([
        ...communityRecipes,
        ...communityRecipesObj.communityRecipes.slice(
          0,
          communityRecipesObj.communityRecipes.length > 12
            ? communityRecipesObj.communityRecipes.length - 1
            : communityRecipesObj.communityRecipes.length,
        ),
      ]);
      setIsThereMoreCommunityRecipes(communityRecipesObj.communityRecipes.length > 12);

      setIsLoadingMoreCommunityRecipes(false);
    }
  };

  return (
    <div className={styles.recipesContainer}>
      <h1>Community</h1>
      {loadingLog ? (
        <div className={styles.recipesCommunityContent}>
          <div className={styles.todayContainer}>
            <h2>Today&#39;s top recipe</h2>
            <div className={styles.todayRecipes}>
              <RecipeCardShimmer key={`Shimmer for today's recipe on community page`} />
            </div>
          </div>
          <div className={styles.todayContainer}>
            <h2>All time recipes</h2>
            <div className={styles.recipes}>
              {[...Array(4).keys()].map((i) => (
                <RecipeCardShimmer key={`Shimmer for recipe ${i} on recipe list on community page`} />
              ))}
            </div>
          </div>
        </div>
      ) : !userAtom?.premium ? (
        <div className={styles.recipesCommunityContent}>
          <div className={styles.todayContainer}>
            <h2>Today&#39;s top recipe</h2>
            <div className={styles.todayRecipes}>
              {todayCommunityRecipes.length ? (
                todayCommunityRecipes.slice(0, 1).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
              ) : (
                <div className={styles.noTodayRecipe}>
                  <TextButton
                    text="No recipe created today yet. Be the first!"
                    onClick={() => navigate('/recipes/new')}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.todayContainer}>
            <h2>All time recipes</h2>
            <div className={styles.recipes}>
              {communityRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
          {isThereMoreCommunityRecipes ? (
            <div className={styles.loadMore}>
              <Button
                text={isLoadingMoreCommunityRecipes ? 'Loading' : 'Load more'}
                onClick={() => loadMoreCommunityRecipes()}
                icon={!isLoadingMoreCommunityRecipes ? <AiOutlinePlus /> : <GiSandsOfTime />}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.noRecipes}>
          <img src={ChefBro} alt="cuate" />
          <span>This is a premium feature</span>
          <Button
            text="Become Premium to Access It!"
            onClick={() => window.open(import.meta.env.VITE_PAYMENT_LINK, '_self')}
          />
        </div>
      )}
    </div>
  );
}
