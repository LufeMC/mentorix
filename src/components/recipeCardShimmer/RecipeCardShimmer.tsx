import ShimmerText from '../shimmerText/ShimmerText';
import styles from './RecipeCardShimmer.module.scss';
import { AiFillClockCircle, AiFillLike } from 'react-icons/ai';
import { LuChefHat } from 'react-icons/lu';

export default function RecipeCardShimmer() {
  return (
    <div className={styles.recipeCardContainer}>
      <div className={styles.recipeCard}>
        <div className={styles.header}>
          <span>
            <ShimmerText>No mealtype</ShimmerText>
          </span>
          <span>
            <ShimmerText>No servings</ShimmerText>
          </span>
        </div>
        <div className={styles.text}>
          <h1>
            <ShimmerText>Shimmer title for recipe</ShimmerText>
          </h1>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerRow}>
            <span>
              <ShimmerText>Created by you</ShimmerText>
            </span>
            <div className={styles.iconItem}>
              <AiFillLike />
              <span>
                <ShimmerText>0</ShimmerText>
              </span>
            </div>
          </div>
          <div className={styles.footerRow}>
            <div className={styles.iconItem}>
              <AiFillClockCircle />
              <span>
                <ShimmerText>30 minutes</ShimmerText>
              </span>
            </div>
            <div className={styles.iconItem}>
              <LuChefHat />
              <span>
                <ShimmerText>Unknown cuisine</ShimmerText>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.recipeCardEffect}></div>
    </div>
  );
}
