import { useAtomValue, useSetAtom } from 'jotai';
import styles from './HomePage.module.scss';
import { UserAtom } from '../../../stores/userStore';
import { CurrentPageAtom, LoadingAtom } from '../../../stores/loadingStore';
import { useEffect, useState } from 'react';
import ShimmerText from '../../../components/shimmerText/ShimmerText';
import { AiOutlinePlus } from 'react-icons/ai';
import { CommunityRecipesAtom, RecipesAtom } from '../../../stores/recipesStore';
import ChefCuate from '../../../assets/img/Chef-cuate.svg';
import ChefPana from '../../../assets/img/Chef-pana.svg';
import Button from '../../../components/button/Button';
import RecipeCardShimmer from '../../../components/recipeCardShimmer/RecipeCardShimmer';
import RecipeCard from '../../../components/recipeCard/RecipeCard';
import TextButton from '../../../components/button/textButton/TextButton';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const user = useAtomValue(UserAtom);
  const recipes = useAtomValue(RecipesAtom);
  const loadingLog = useAtomValue(LoadingAtom);
  const communityRecipes = useAtomValue(CommunityRecipesAtom);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const [communityError, setCommunityError] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage('home');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkOutTheCommunity = () => {
    if (user?.premium) {
      navigate('/community');
    } else if (!communityError) {
      setCommunityError(true);
    } else {
      window.open(import.meta.env.VITE_PAYMENT_LINK, '_self');
    }
  };

  return (
    <div className={styles.homePage}>
      {user ? (
        <h1>Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
      ) : (
        <ShimmerText>
          <h1>Welcome, user!</h1>
        </ShimmerText>
      )}
      <div className={styles.content}>
        <div className={styles.recipesContainer}>
          <div className={styles.title}>
            <h2>Your Recipes</h2>
          </div>
          <div className={styles.recipes}>
            {user ? (
              recipes.length ? (
                <div className={styles.recipeList}>
                  {recipes.slice(0, 4).map((recipe) => (
                    <RecipeCard recipe={recipe} key={`recipe card of recipe #${recipe.id}`} />
                  ))}
                </div>
              ) : (
                <div className={styles.noRecipes}>
                  <img src={ChefCuate} alt="cuate" />
                  <span>You don&#39;t have recipes to show yet</span>
                  <Button text="Create recipe" onClick={() => navigate('/recipes/new')} icon={<AiOutlinePlus />} />
                </div>
              )
            ) : (
              <div className={styles.recipeList}>
                {[...Array(4).keys()].map((index) => (
                  <RecipeCardShimmer key={`recipe card shimmer of index: ${index}`} />
                ))}
              </div>
            )}
            {recipes.length ? (
              <div className={styles.seeAll}>
                <TextButton text="See all recipes" onClick={() => navigate('/recipes')} disabled={loadingLog} />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.communityRecipesContainer}>
          <h2>Most Liked Community Recipes</h2>
          <span>Check out the recipes created by the community</span>
          <div className={styles.recipes}>
            {user ? (
              communityRecipes.length ? (
                <div className={styles.communityRecipeList}>
                  {communityRecipes.slice(0, 2).map((recipe, index) => (
                    <RecipeCard recipe={recipe} key={`recipe card of community recipe #${recipe.id} - ${index}`} />
                  ))}
                </div>
              ) : (
                <div className={styles.noRecipes}>
                  <img src={ChefPana} alt="cuate" />
                  <span>The community still have not posted any recipe</span>
                  <Button text="Be the first!" onClick={() => navigate('/recipes/new')} icon={<AiOutlinePlus />} />
                </div>
              )
            ) : (
              <div className={styles.communityRecipeList}>
                {[...Array(2).keys()].map((index) => (
                  <RecipeCardShimmer key={`recipe card shimmer of index: ${index}`} />
                ))}
              </div>
            )}
            <div className={styles.seeAll}>
              <TextButton
                text={communityError ? 'This is a premium feature. Become premium now!' : 'Check out the community'}
                onClick={() => checkOutTheCommunity()}
                disabled={loadingLog}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
