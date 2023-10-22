import { useContext, useEffect } from 'react';
import Navbar from '../../navbar/Navbar';
import styles from './Recipe.module.scss';
import { FirebaseContext } from '../../../../contexts/firebase-context';
import { useNavigate, useParams } from 'react-router-dom';
import RecipeService from '../../../../services/recipe.service';

export default function Recipe() {
  const firebaseContext = useContext(FirebaseContext);
  const { recipeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipeId) {
      getRecipe(recipeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const getRecipe = async (recipeId: string) => {
    const recipe = await RecipeService.getRecipeById(firebaseContext.firestore, recipeId);

    if (typeof recipe === 'string') {
      navigate('/');
    } else if (typeof recipe !== 'undefined') {
      console.log(recipe);
    }
  };
  return (
    <div className={styles.recipe}>
      <Navbar darkSchema={true} />
      <div className={styles.content}>
        <div className={styles.instructions}></div>
        <div className={styles.details}></div>
      </div>
    </div>
  );
}
