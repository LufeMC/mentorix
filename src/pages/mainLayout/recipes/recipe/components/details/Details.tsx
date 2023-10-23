import { Recipe } from '../../../../../../types/recipe';
import styles from './Details.module.scss';
import { PiCookingPot, PiKnife } from 'react-icons/pi';
import Checkbox from '../../../../../../components/checkbox/Checkbox';
import { capitalizeWord } from '../../../../../../utils/string';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export default function RecipeDetails(props: RecipeDetailsProps) {
  return (
    <div className={styles.details}>
      <div className={styles.basicDetails}>
        <div className={styles.property}>
          <PiKnife />
          <span>Preparation: {props.recipe.preparationTime}</span>
        </div>
        <div className={styles.property}>
          <PiCookingPot />
          <span>Cooking: {props.recipe.cookingTime}</span>
        </div>
      </div>
      <div className={styles.ingredientContainer}>
        <h2>Ingredients</h2>
        <div className={styles.ingredientList}>
          {props.recipe.ingredients.map((ingredient) => (
            <div className={styles.ingredient} key={ingredient.ingredient}>
              <Checkbox text="" onChange={() => {}} />
              <span className={styles.quantity}>{capitalizeWord(ingredient.quantity)}</span>
              <span className={styles.ingredientName}>{capitalizeWord(ingredient.ingredient)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
