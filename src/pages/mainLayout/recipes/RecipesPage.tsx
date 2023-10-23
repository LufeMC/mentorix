import { Link, useNavigate } from 'react-router-dom';
import useRecipesStore from '../../../stores/recipesStore';
import useUserStore from '../../../stores/userStore';
import styles from './RecipesPage.module.scss';
import RecipeCard from './components/recipeCard/RecipeCard';
import { useEffect } from 'react';

export default function RecipesPage() {
  const recipesStore = useRecipesStore();
  const userStore = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userStore.user) {
      navigate('/');
    }
  });

  return (
    <div className={styles.recipesContainer}>
      {!userStore.user?.premium ? (
        recipesStore.recipes.length ? (
          <div className={styles.recipes}>
            {recipesStore.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className={styles.notice}>
            <span>You don&#39;t have any recipes saved yet</span>
          </div>
        )
      ) : (
        <div className={styles.notice}>
          <span>
            This is a premium feature. Check out our plans <Link to={'/plans'}>here</Link>
          </span>
        </div>
      )}
    </div>
  );
}
