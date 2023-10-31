import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './CreateRecipe.module.scss';
import HomeSection from './components/section/HomeSection';
import HomeItem from './components/item/HomeItem';
import { RecipeOptions } from '../../../../types/recipe';
import DietRestrictions from '../../../../assets/jsons/dietRestrictions.json';
import Cuisines from '../../../../assets/jsons/cuisine.json';
import Ingredients from '../../../../assets/jsons/ingredients.json';
import { capitalizeWord, capitalizeWordsInArray } from '../../../../utils/string';
import Button from '../../../../components/button/Button';
import RecipeService from '../../../../services/recipe.service';
import { FirebaseContext } from '../../../../contexts/firebase-context';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../../../contexts/alert-context';
import { Alert } from '../../../../stores/alertStore';
import { useAtom, useSetAtom } from 'jotai';
import { UserAtom } from '../../../../stores/userStore';
import { logEvent } from 'firebase/analytics';
import { CurrentPageAtom } from '../../../../stores/loadingStore';
import NoBorderInput from '../../../../components/input/noBorderInput/NoBorderInput';
import TextButton from '../../../../components/button/textButton/TextButton';
import {
  CommunityRecipesAtom,
  LoadingRecipeAtom,
  RecipesAtom,
  TodayCommunityRecipesAtom,
} from '../../../../stores/recipesStore';

// Define the initial options
const initialOptions: RecipeOptions = {
  servings: ['1 or 2', '3 or 4', '5 or 6', 'More than 6'],
  dietRestrictions: capitalizeWordsInArray(DietRestrictions),
  cuisine: capitalizeWordsInArray(Cuisines),
  mealType: [
    'Breakfast',
    'Morning snack',
    'Lunch',
    'Afternoon snack',
    'Dinner',
    'Evening snack',
    'Cocktail',
    'Dessert',
    'Midnight snack',
  ],
  ingredients: capitalizeWordsInArray(Ingredients),
};

export default function CreateRecipe() {
  const [user, setUser] = useAtom(UserAtom);
  const [recipes, setRecipes] = useAtom(RecipesAtom);
  const [communityRecipes, setCommunityRecipes] = useAtom(CommunityRecipesAtom);
  const [todayCommunityRecipes, setTodayCommunityRecipes] = useAtom(TodayCommunityRecipesAtom);
  const [loadingRecipe, setLoadingRecipe] = useAtom(LoadingRecipeAtom);
  const setCurrentPage = useSetAtom(CurrentPageAtom);

  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);

  const navigate = useNavigate();
  const rawOptions = useMemo<RecipeOptions>(() => initialOptions, []);

  const [selectedItems, setSelectedItems] = useState<RecipeOptions>({
    servings: [],
    dietRestrictions: [],
    cuisine: [],
    mealType: [],
    ingredients: [],
    carbs: '',
    protein: '',
    fat: '',
    additionalDetails: '',
  });

  useEffect(() => {
    setCurrentPage('recipes-new');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeItems = (newItems: string[] | string | number, category: keyof RecipeOptions) => {
    let selectedItemsInCategory = structuredClone(selectedItems[category as keyof RecipeOptions]);
    selectedItemsInCategory = newItems;

    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [category]: selectedItemsInCategory,
    }));
  };

  const createRecipe = async (premium = true) => {
    const recipe = structuredClone(selectedItems);

    if (!premium) {
      recipe.carbs = '';
      recipe.protein = '';
      recipe.fat = '';
    }

    logEvent(firebaseContext.analytics, 'create_recipe_clicked');
    alertContext.resetAlert();
    setLoadingRecipe(true);
    const formattedText = `I want to create a recipe. I want a ${selectedItems.mealType[0] ?? 'meal'} in a ${
      selectedItems.cuisine[0] ?? 'unknown'
    } cuisine${
      selectedItems.servings[0] ? ` that serves ${selectedItems.servings[0]} people.` : '.'
    } I have these dietary restrictions: ${
      selectedItems.dietRestrictions.length ? selectedItems.dietRestrictions.join(',') : 'None'
    }. ${
      selectedItems.ingredients.length ? `I have these ingredients: ${selectedItems.ingredients.join(',')}` : ''
    }. The meal needs these macronutrients: ${selectedItems.carbs ?? 'any'} grams of carbs, ${
      selectedItems.protein ?? 'any'
    } grams of proteins and ${selectedItems.fat ?? 'any'} grams of fat.${
      selectedItems.additionalDetails ? ` These are the additional details: ${selectedItems.additionalDetails}` : ''
    }`;
    try {
      const recipe = await RecipeService.createRecipe(
        formattedText,
        selectedItems,
        firebaseContext.firestore,
        user,
        setUser,
        recipes,
        setRecipes,
        communityRecipes,
        setCommunityRecipes,
        todayCommunityRecipes,
        setTodayCommunityRecipes,
      );
      window.sessionStorage.setItem('recipeGenerated', recipe.id);
      navigate(`/recipes/${recipe.id}`);
      logEvent(firebaseContext.analytics, 'recipe_created');
    } catch (err) {
      const newAlert: Alert = {
        message: 'An error occured. Try again later',
        type: 'error',
      };
      alertContext.startAlert(newAlert);
      logEvent(firebaseContext.analytics, 'error_on_creating_recipe');
    } finally {
      setLoadingRecipe(false);
    }
  };

  const canCreateRecipe = () => {
    return selectedItems.ingredients.length;
  };

  const isPremiumFeature = () => {
    return selectedItems.carbs || selectedItems.protein || selectedItems.fat;
  };

  return (
    <div className={styles.homePage}>
      <h1>What are we cooking today?</h1>
      <div className={styles.content}>
        <div className={styles.options}>
          <HomeSection>
            <div className={styles.row}>
              <HomeItem
                id="servings"
                title="How many people are you serving?"
                items={rawOptions.servings}
                selectedItems={selectedItems.servings}
                changeItems={(newItem: string[]) => changeItems(newItem, 'servings')}
              />
              <HomeItem
                id="diet restrictions"
                isMulti={true}
                title="Do you have any dietary restrictions?"
                items={rawOptions.dietRestrictions}
                selectedItems={selectedItems.dietRestrictions}
                changeItems={(newItems: string[]) => changeItems(newItems, 'dietRestrictions')}
              />
            </div>
            <div className={styles.row}>
              <HomeItem
                id="cuisine"
                title="What cuisine are you looking for?"
                items={rawOptions.cuisine}
                selectedItems={selectedItems.cuisine}
                changeItems={(newItem: string[]) => changeItems(newItem, 'cuisine')}
              />
              <HomeItem
                id="meal type"
                title="What type of meal you are cooking?"
                items={rawOptions.mealType}
                selectedItems={selectedItems.mealType}
                changeItems={(newItem: string[]) => changeItems(newItem, 'mealType')}
              />
            </div>
            <div className={styles.row}>
              <HomeItem
                id="ingredients"
                isMulti={true}
                title="What ingredients do you have? *"
                items={rawOptions.ingredients}
                selectedItems={selectedItems.ingredients}
                changeItems={(newItems: string[]) => changeItems(newItems, 'ingredients')}
              />
            </div>
          </HomeSection>
          <HomeSection>
            <h3>Macronutrients</h3>
            <div className={styles.row}>
              <div className={styles.inputs}>
                <div className={styles.input}>
                  <NoBorderInput
                    id="carbs"
                    type="number"
                    placeholder="Carbs in grams"
                    title="Carbs"
                    value={selectedItems.carbs as string}
                    onChange={(e) => changeItems(e.target.value, 'carbs')}
                  />
                  <span>g</span>
                </div>
                <div className={styles.input}>
                  <NoBorderInput
                    id="proteins"
                    type="number"
                    placeholder="Proteins in grams"
                    title="Proteins"
                    value={selectedItems.protein as string}
                    onChange={(e) => changeItems(e.target.value, 'protein')}
                  />
                  <span>g</span>
                </div>
                <div className={styles.input}>
                  <NoBorderInput
                    id="fat"
                    type="number"
                    placeholder="Fat in grams"
                    title="Fat"
                    value={selectedItems.fat as string}
                    onChange={(e) => changeItems(e.target.value, 'fat')}
                  />
                  <span>g</span>
                </div>
              </div>
            </div>
          </HomeSection>
          <div className={styles.extras}>
            <HomeSection>
              <h3>Anything else?</h3>
              <div className={styles.row}>
                <textarea
                  className={styles.textarea}
                  placeholder="Wanna say anything else?"
                  onChange={(e) => changeItems(e.target.value, 'additionalDetails')}
                />
              </div>
            </HomeSection>
          </div>
          <div className={styles.actionsMobile}>
            {!canCreateRecipe() ? <span>Please add an ingredient to continue</span> : null}
            {isPremiumFeature() && canCreateRecipe() && !user?.premium ? (
              <span>Macronutrients is a premium feature</span>
            ) : null}
            <Button
              text={isPremiumFeature() && !user?.premium ? 'Upgrade and create recipe' : 'Create recipe'}
              onClick={() =>
                isPremiumFeature() && !user?.premium
                  ? window.open(import.meta.env.VITE_PAYMENT_LINK, '_self')
                  : createRecipe()
              }
              disabled={!canCreateRecipe() || loadingRecipe}
            />
            {isPremiumFeature() && canCreateRecipe() && !user?.premium ? (
              <TextButton text="Create recipe without macronutrients" onClick={() => createRecipe(false)} />
            ) : null}
          </div>
        </div>
        <div className={styles.summary}>
          <div className={styles.ingredientsContainer}>
            <h2>Ingredients you selected</h2>
            <div className={styles.ingredients}>
              {selectedItems.ingredients.map((ingredient) => (
                <h3 key={`selected-${ingredient}`}>{capitalizeWord(ingredient)}</h3>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            {!canCreateRecipe() ? <span>Please add an ingredient to continue</span> : null}
            {isPremiumFeature() && canCreateRecipe() && !user?.premium ? (
              <span>Macronutrients is a premium feature</span>
            ) : null}
            <Button
              text={isPremiumFeature() && !user?.premium ? 'Upgrade and create recipe' : 'Create recipe'}
              onClick={() =>
                isPremiumFeature() && !user?.premium
                  ? window.open(import.meta.env.VITE_PAYMENT_LINK, '_self')
                  : createRecipe()
              }
              disabled={!canCreateRecipe() || loadingRecipe}
            />
            {isPremiumFeature() && canCreateRecipe() && !user?.premium ? (
              <TextButton text="Create recipe without macronutrients" onClick={() => createRecipe(false)} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
