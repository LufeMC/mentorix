import { useContext, useEffect, useState } from 'react';
import { Recipe } from '../../../../../types/recipe';
import styles from './RecipeCard.module.scss';
import { LuShare } from 'react-icons/lu';
import { BsBookmarkFill } from 'react-icons/bs';
import RecipeService from '../../../../../services/recipe.service';
import { AlertContext } from '../../../../../contexts/alert-context';
import { Alert, alertTypes } from '../../../../../stores/alertStore';
import { FirebaseContext } from '../../../../../contexts/firebase-context';
import useUserStore from '../../../../../stores/userStore';
import useRecipesStore from '../../../../../stores/recipesStore';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard(props: RecipeCardProps) {
  const alertContext = useContext(AlertContext);
  const firebaseContext = useContext(FirebaseContext);

  const userStore = useUserStore();
  const recipesStores = useRecipesStore();

  const [style, setStyle] = useState<string>();

  useEffect(() => {
    const styleClasses = [styles.red, styles.green, styles.yellow, styles.white, styles.grey];
    setStyle(getRandomStyleClass(styleClasses));
  }, []);

  const getRandomStyleClass = (stylesArray: string[]): string | undefined => {
    if (stylesArray.length === 0) {
      return undefined; // Return undefined for an empty array
    }

    const randomIndex = Math.floor(Math.random() * stylesArray.length);
    return stylesArray[randomIndex];
  };

  const alertHandler = (text: string, type: keyof typeof alertTypes) => {
    const newAlert: Alert = {
      message: text,
      type,
    };
    alertContext.setAlert(newAlert);
  };

  const shareRecipe = () => {
    RecipeService.shareRecipe(alertHandler, undefined, props.recipe);
  };

  const unbookmarkRecipe = async () => {
    RecipeService.unBookmarkRecipe(firebaseContext.firestore, userStore, recipesStores, props.recipe);
  };

  return (
    <Link to={`/recipes/${props.recipe.id}/${props.recipe.shareId}`} className={`${styles.recipeCard} ${style}`}>
      <div className={styles.circle} />
      <span>{props.recipe.title}</span>
      <div className={styles.actions}>
        <LuShare
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            shareRecipe();
          }}
        />
        <BsBookmarkFill
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault();
            unbookmarkRecipe();
          }}
        />
      </div>
    </Link>
  );
}
