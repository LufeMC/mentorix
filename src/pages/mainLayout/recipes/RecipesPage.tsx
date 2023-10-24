import { Link, useNavigate } from 'react-router-dom';
import { RecipesAtom } from '../../../stores/recipesStore';
import { UserAtom } from '../../../stores/userStore';
import styles from './RecipesPage.module.scss';
import RecipeCard from './components/recipeCard/RecipeCard';
import { useEffect } from 'react';
import { useAtomValue } from 'jotai';

export default function RecipesPage() {
  const user = useAtomValue(UserAtom);
  const recipes = useAtomValue(RecipesAtom);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  });

  return (
    <div className={styles.recipesContainer}>
      {user?.premium ? (
        recipes.length ? (
          <div className={styles.recipes}>
            {recipes.map((recipe) => (
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
