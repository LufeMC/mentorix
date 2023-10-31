import { Recipe } from '../../../../../../types/recipe';
import styles from './Details.module.scss';
import Checkbox from '../../../../../../components/checkbox/Checkbox';
import { capitalizeWord } from '../../../../../../utils/string';
import { AiFillClockCircle } from 'react-icons/ai';
import { LuChefHat } from 'react-icons/lu';
import { PiCookingPot } from 'react-icons/pi';

interface RecipeDetailsProps {
  recipe: Recipe;
}

export default function RecipeDetails(props: RecipeDetailsProps) {
  return (
    <div className={styles.details}>
      <div className={styles.basicDetails}>
        {props.recipe.cookingTime && (
          <div className={styles.property}>
            <AiFillClockCircle />
            <span>{props.recipe.cookingTime}</span>
          </div>
        )}
        {props.recipe.cuisine && (
          <div className={styles.property}>
            <LuChefHat />
            <span>{props.recipe.cuisine} Cuisine</span>
          </div>
        )}
        {props.recipe.dietRestrictions?.length && (
          <div className={styles.property}>
            <PiCookingPot />
            <span>{props.recipe.dietRestrictions.join(', ')}</span>
          </div>
        )}
      </div>
      <div className={styles.ingredientContainer}>
        <h2>Ingredients</h2>
        <div className={styles.ingredientList}>
          {props.recipe.ingredients.map((ingredient) =>
            ingredient.ingredient ? (
              <div className={styles.ingredient} key={ingredient.ingredient}>
                <Checkbox text="" onChange={() => {}} />
                <span className={styles.quantity}>{capitalizeWord(ingredient.quantity)}</span>
                <span className={styles.ingredientName}>{capitalizeWord(ingredient.ingredient)}</span>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
