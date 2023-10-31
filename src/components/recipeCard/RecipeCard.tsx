import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../types/recipe';
import styles from './RecipeCard.module.scss';
import { AiFillClockCircle, AiFillLike } from 'react-icons/ai';
import { LuChefHat } from 'react-icons/lu';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export default function RecipeCard(props: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <button
      className={styles.recipeCardContainer}
      onClick={() => (props.onClick ? props.onClick() : navigate(`/recipes/${props.recipe.id}`))}
    >
      <div className={`${styles.recipeCard} ${props.recipe && props.recipe.img ? styles.imageBackground : ''}`}>
        {props.recipe && props.recipe.img && (
          <div className={styles.backgroundOverlay} style={{ backgroundImage: `url(${props.recipe.img})` }}></div>
        )}
        <div className={styles.header}>
          <span>{props.recipe.mealType ?? 'No mealtype'}</span>
          <span>{props.recipe.servings ?? 'No'} servings</span>
        </div>
        <div className={styles.title}>
          <h2>{props.recipe.title}</h2>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerRow}>
            <span>Created by {props.recipe.creator ? props.recipe.creator?.name.split(' ')[0] : 'you'}</span>
            <div className={styles.iconItem}>
              <AiFillLike />
              <span>{props.recipe.likes ? props.recipe.likes.length : 0}</span>
            </div>
          </div>
          <div className={styles.footerRow}>
            <div className={styles.iconItem}>
              <AiFillClockCircle />
              <span>{props.recipe.cookingTime ?? 0}</span>
            </div>
            <div className={styles.iconItem}>
              <LuChefHat />
              <span>{props.recipe.cuisine ?? 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.recipeCardEffect}></div>
    </button>
  );
}
