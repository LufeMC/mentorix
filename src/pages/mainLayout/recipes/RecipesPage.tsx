import { useNavigate } from 'react-router-dom';
import { IsThereMoreRecipesAtom, RecipesAtom } from '../../../stores/recipesStore';
import { UserAtom } from '../../../stores/userStore';
import styles from './RecipesPage.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { logEvent } from 'firebase/analytics';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { useAuthState } from 'react-firebase-hooks/auth';
import RecipeCard from '../../../components/recipeCard/RecipeCard';
import { CurrentPageAtom, LoadingAtom } from '../../../stores/loadingStore';
import Button from '../../../components/button/Button';
import { AiOutlinePlus } from 'react-icons/ai';
import { GiSandsOfTime } from 'react-icons/gi';
import ChefCuate from '../../../assets/img/Chef-cuate.svg';
import RecipeService from '../../../services/recipe.service';
import { User } from '../../../types/user';
import RecipeCardShimmer from '../../../components/recipeCardShimmer/RecipeCardShimmer';

export default function RecipesPage() {
  const userAtom = useAtomValue(UserAtom);
  const [recipes, setRecipes] = useAtom(RecipesAtom);
  const [isThereMoreRecipes, setIsThereMoreRecipes] = useAtom(IsThereMoreRecipesAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const logging = useRef<boolean>(false);

  const [isLoadingMoreRecipes, setIsLoadingMoreRecipes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !loadingLog) {
      if (!user && !userAtom) {
        navigate('/');
      }

      setCurrentPage('recipes');

      if (!logging.current) {
        logging.current = true;
        logEvent(firebaseContext.analytics, 'recipes_page_open');
        logging.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingLog]);

  const loadMoreRecipes = async () => {
    if (!isLoadingMoreRecipes) {
      setIsLoadingMoreRecipes(true);

      const newRecipes = await RecipeService.getRecipes(firebaseContext.firestore, userAtom as User);
      setRecipes([
        ...recipes,
        ...newRecipes.slice(0, newRecipes.length > 12 ? newRecipes.length - 1 : newRecipes.length),
      ]);
      setIsThereMoreRecipes(recipes.length > 12);
      setIsLoadingMoreRecipes(false);
    }
  };

  return (
    <div className={styles.recipesContainer}>
      <h1>Your Recipes</h1>
      {loadingLog ? (
        <div className={styles.recipesList}>
          <div className={styles.recipes}>
            {[...Array(4).keys()].map((i) => (
              <RecipeCardShimmer key={`Shimmer for recipe ${i} on recipe list`} />
            ))}
          </div>
        </div>
      ) : recipes.length ? (
        <div className={styles.recipesList}>
          <div className={styles.recipes}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {isThereMoreRecipes ? (
            <div className={styles.loadMore}>
              <Button
                text={isLoadingMoreRecipes ? 'Loading' : 'Load more'}
                onClick={() => loadMoreRecipes()}
                icon={!isLoadingMoreRecipes ? <AiOutlinePlus /> : <GiSandsOfTime />}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.noRecipes}>
          <img src={ChefCuate} alt="cuate" />
          <span>You don&#39;t have recipes to show yet</span>
          <Button text="Create recipe" onClick={() => navigate('/recipes/new')} icon={<AiOutlinePlus />} />
        </div>
      )}
    </div>
  );
}
