import { Link, useNavigate } from 'react-router-dom';
import { RecipesAtom } from '../../../stores/recipesStore';
import { UserAtom } from '../../../stores/userStore';
import styles from './RecipesPage.module.scss';
import RecipeCard from './components/recipeCard/RecipeCard';
import { useContext, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { logEvent } from 'firebase/analytics';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function RecipesPage() {
  const userAtom = useAtomValue(UserAtom);
  const recipes = useAtomValue(RecipesAtom);
  const firebaseContext = useContext(FirebaseContext);
  const [user, loading] = useAuthState(firebaseContext.auth);

  const logging = useRef<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user && !userAtom) {
        navigate('/');
      }

      if (!logging.current) {
        logging.current = true;
        logEvent(firebaseContext.analytics, 'recipes_page_open');
        logging.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className={styles.recipesContainer}>
      {!userAtom?.premium ? (
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
