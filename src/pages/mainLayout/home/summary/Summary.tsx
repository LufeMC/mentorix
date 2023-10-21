import { useEffect } from 'react';
import { RecipeOptions } from '../../../../types/recipe';
import styles from './Summary.module.scss';

interface SummaryProps {
  selectedItems: RecipeOptions;
  text: JSX.Element;
  setText: React.Dispatch<React.SetStateAction<JSX.Element>>;
}

export default function Summary(props: SummaryProps) {
  useEffect(() => {
    generateSummaryText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedItems]);

  const generateSummaryText = () => {
    const ingredientsText = props.selectedItems.ingredients.length ? (
      <span>
        <br />
        <br />
        The ingredients I have are:
        <br />
        <em className={styles.emphasisIngredients}>
          {props.selectedItems.ingredients.join(', ').replace(/'/g, '&apos;')}
        </em>
      </span>
    ) : null;

    if (
      props.selectedItems.servings.length &&
      props.selectedItems.dietRestrictions.length &&
      props.selectedItems.cuisine.length &&
      props.selectedItems.mealType.length
    ) {
      props.setText(
        <span>
          I have chosen to prepare a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>
          that serves <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (
      props.selectedItems.cuisine.length &&
      props.selectedItems.mealType.length &&
      props.selectedItems.servings.length
    ) {
      props.setText(
        <span>
          I am planning to make a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em> that serves
          <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (
      props.selectedItems.cuisine.length &&
      props.selectedItems.mealType.length &&
      props.selectedItems.dietRestrictions.length
    ) {
      props.setText(
        <span>
          I will be preparing a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>.
        </span>,
      );
      return;
    }

    if (
      props.selectedItems.cuisine.length &&
      props.selectedItems.servings.length &&
      props.selectedItems.dietRestrictions.length
    ) {
      props.setText(
        <span>
          I am going to cook a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em> meal
          that serves
          <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (
      props.selectedItems.mealType.length &&
      props.selectedItems.servings.length &&
      props.selectedItems.dietRestrictions.length
    ) {
      props.setText(
        <span>
          I am preparing a<em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>
          ,<em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em> meal
          for
          <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.cuisine.length && props.selectedItems.mealType.length) {
      props.setText(
        <span>
          I will be making a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>.
          {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.cuisine.length && props.selectedItems.servings.length) {
      props.setText(
        <span>
          I am going to prepare a
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em> meal that serves
          <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.cuisine.length && props.selectedItems.dietRestrictions.length) {
      props.setText(
        <span>
          I will be cooking a
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em> meal.
          {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.mealType.length && props.selectedItems.servings.length) {
      props.setText(
        <span>
          I am planning to make
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em> for
          <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.mealType.length && props.selectedItems.dietRestrictions.length) {
      props.setText(
        <span>
          I will be preparing
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em>,
          <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>.
          {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.servings.length && props.selectedItems.dietRestrictions.length) {
      props.setText(
        <span>
          I am cooking a
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em> meal
          for <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people. {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.cuisine.length) {
      props.setText(
        <span>
          I am making a <em className={styles.emphasis}>{props.selectedItems.cuisine[0].replace(/'/g, '&apos;')}</em>
          meal. {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.mealType.length) {
      props.setText(
        <span>
          I am preparing <em className={styles.emphasis}>{props.selectedItems.mealType[0].replace(/'/g, '&apos;')}</em>.
          {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.servings.length) {
      props.setText(
        <span>
          I am making a meal that serves <em className={styles.emphasis}>{props.selectedItems.servings[0]}</em> people.
          {ingredientsText}
        </span>,
      );
      return;
    }

    if (props.selectedItems.dietRestrictions.length) {
      props.setText(
        <span>
          I am preparing a
          <em className={styles.emphasis}>{props.selectedItems.dietRestrictions[0].replace(/'/g, '&apos;')}</em> meal.
          {ingredientsText}
        </span>,
      );
      return;
    }

    props.setText(ingredientsText || <></>);
    return;
  };

  return <div className={styles.summary}>{props.text}</div>;
}
