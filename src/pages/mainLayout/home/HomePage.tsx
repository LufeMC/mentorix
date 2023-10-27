import { ChangeEvent, useContext, useMemo, useState } from 'react';
import styles from './HomePage.module.scss';
import HomeSection from './components/section/HomeSection';
import HomeItem from './components/item/HomeItem';
import { RecipeFilters, RecipeOptions } from '../../../types/recipe';
import DietRestrictions from '../../../assets/jsons/dietRestrictions.json';
import Cuisines from '../../../assets/jsons/cuisine.json';
import Ingredients from '../../../assets/jsons/ingredients.json';
import { capitalizeWordsInArray, jsxElementToStringWithWhitespace } from '../../../utils/string';
import Summary from './components/summary/Summary';
import Button from '../../../components/button/Button';
import WhiteLogo from '../../../assets/img/logo-white.svg';
import RecipeService from '../../../services/recipe.service';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { Link, useNavigate } from 'react-router-dom';
import { AlertContext } from '../../../contexts/alert-context';
import { Alert } from '../../../stores/alertStore';
import { useAtom, useAtomValue } from 'jotai';
import { UserAtom } from '../../../stores/userStore';
import { TempUserAtom } from '../../../stores/tempUserStore';
import { LoadingRecipeAtom } from '../../../stores/recipesStore';
import { LoadingAtom } from '../../../stores/loadingStore';
import { logEvent } from 'firebase/analytics';

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

// Define the initial options
const initialFilters: RecipeFilters = {
  dietRestrictions: '',
  cuisine: '',
  ingredients: '',
};

export default function HomePage() {
  const [user, setUser] = useAtom(UserAtom);
  const [tempUser, setTempUser] = useAtom(TempUserAtom);
  const [loadingRecipe, setLoadingRecipe] = useAtom(LoadingRecipeAtom);
  const loading = useAtomValue(LoadingAtom);
  const firebaseContext = useContext(FirebaseContext);
  const alertContext = useContext(AlertContext);
  const navigate = useNavigate();
  const rawOptions = useMemo<RecipeOptions>(() => initialOptions, []);

  const [filteredOptions, setFilteredOptions] = useState<RecipeOptions>({
    servings: rawOptions.servings,
    dietRestrictions: rawOptions.dietRestrictions.slice(0, 10),
    cuisine: rawOptions.cuisine.slice(0, 10),
    mealType: rawOptions.mealType,
    ingredients: rawOptions.ingredients.slice(0, 25),
  });

  const [selectedItems, setSelectedItems] = useState<RecipeOptions>({
    servings: [],
    dietRestrictions: [],
    cuisine: [],
    mealType: [],
    ingredients: [],
  });

  const [filters, setFilters] = useState<RecipeFilters>(initialFilters);
  const [text, setText] = useState<JSX.Element>(<></>);

  const addOrRemoveItem = (itemName: string, category: string, add: boolean, allowMultile: boolean) => {
    if (!tempUser || (tempUser && tempUser.recipesGenerated < 5)) {
      let selectedItemsInCategory = [...selectedItems[category as keyof RecipeOptions]];

      if (add) {
        if (allowMultile) {
          selectedItemsInCategory.push(itemName);
        } else {
          selectedItemsInCategory = [itemName];
        }

        setSelectedItems((prevSelectedItems) => ({
          ...prevSelectedItems,
          [category]: allowMultile ? [...prevSelectedItems[category as keyof RecipeOptions], itemName] : [itemName],
        }));
      } else {
        selectedItemsInCategory = selectedItemsInCategory.filter((item) => item !== itemName);
        setSelectedItems((prevSelectedItems) => ({
          ...prevSelectedItems,
          [category]: prevSelectedItems[category as keyof RecipeOptions].filter((item) => item !== itemName),
        }));
      }

      const updatedOptions = rawOptions[category as keyof RecipeOptions]
        .filter((item) => !selectedItemsInCategory.includes(item))
        .slice(0, category === 'ingredients' ? 25 : 10);

      setFilteredOptions((prevFilteredOptions) => ({
        ...prevFilteredOptions,
        [category]: updatedOptions,
      }));
      setFilters(initialFilters);
    }
  };

  const filterOptions = (searchValue: string, category: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: searchValue,
    }));

    const selectedItemsInCategory = [...selectedItems[category as keyof RecipeOptions]];
    const updatedOptions = rawOptions[category as keyof RecipeOptions]
      .filter(
        (item) => !selectedItemsInCategory.includes(item) && item.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .slice(0, category === 'ingredients' ? 25 : 10);
    setFilteredOptions((prevFilteredOptions) => ({
      ...prevFilteredOptions,
      [category]: updatedOptions,
    }));
  };

  const createRecipe = async () => {
    logEvent(firebaseContext.analytics, 'create_recipe_clicked');
    if (!loadingRecipe) {
      alertContext.resetAlert();
      setLoadingRecipe(true);
      const formattedText = jsxElementToStringWithWhitespace(text);
      try {
        const recipe = await RecipeService.createRecipe(
          formattedText,
          firebaseContext.firestore,
          user,
          setUser,
          tempUser,
          setTempUser,
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
    }
  };

  const canCreateRecipe = () => {
    return (
      selectedItems.cuisine.length ||
      selectedItems.dietRestrictions.length ||
      selectedItems.mealType.length ||
      selectedItems.ingredients.length
    );
  };

  return (
    <div className={styles.homePage}>
      <h1>Welcome{user ? `, ${user.name}!` : '!'} What are we cooking today?</h1>
      <span>Select at least one ingredient or one basic details item</span>
      <div className={styles.content}>
        <div className={styles.options}>
          <HomeSection title="Basic details" count={1}>
            <HomeItem
              title="How many people are you serving? (Optional)"
              items={filteredOptions.servings}
              selectedItems={selectedItems.servings}
              selectItem={(itemName: string) => addOrRemoveItem(itemName, 'servings', true, false)}
              removeItem={(itemName: string) => addOrRemoveItem(itemName, 'servings', false, false)}
            />
            <HomeItem
              title="Do you have any dietary restrictions?"
              items={filteredOptions.dietRestrictions}
              selectedItems={selectedItems.dietRestrictions}
              searchBar={true}
              searchBarValue={filters.dietRestrictions}
              onChangeSearchBarValue={(event: ChangeEvent<HTMLInputElement>) =>
                filterOptions(event.target.value, 'dietRestrictions')
              }
              selectItem={(itemName: string) => addOrRemoveItem(itemName, 'dietRestrictions', true, false)}
              removeItem={(itemName: string) => addOrRemoveItem(itemName, 'dietRestrictions', false, false)}
            />
            <HomeItem
              title="What cuisine are you looking for?"
              items={filteredOptions.cuisine}
              selectedItems={selectedItems.cuisine}
              searchBar={true}
              searchBarValue={filters.cuisine}
              onChangeSearchBarValue={(event: ChangeEvent<HTMLInputElement>) =>
                filterOptions(event.target.value, 'cuisine')
              }
              selectItem={(itemName: string) => addOrRemoveItem(itemName, 'cuisine', true, false)}
              removeItem={(itemName: string) => addOrRemoveItem(itemName, 'cuisine', false, false)}
            />
            <HomeItem
              title="What type of meal you are cooking?"
              items={filteredOptions.mealType}
              selectedItems={selectedItems.mealType}
              selectItem={(itemName: string) => addOrRemoveItem(itemName, 'mealType', true, false)}
              removeItem={(itemName: string) => addOrRemoveItem(itemName, 'mealType', false, false)}
            />
          </HomeSection>
          <HomeSection title="Ingredients" count={2}>
            <HomeItem
              title="What ingredients do you have?"
              items={filteredOptions.ingredients}
              selectedItems={selectedItems.ingredients}
              searchBar={true}
              searchBarValue={filters.ingredients}
              onChangeSearchBarValue={(event: ChangeEvent<HTMLInputElement>) =>
                filterOptions(event.target.value, 'ingredients')
              }
              selectItem={(itemName: string) => addOrRemoveItem(itemName, 'ingredients', true, true)}
              removeItem={(itemName: string) => addOrRemoveItem(itemName, 'ingredients', false, true)}
            />
          </HomeSection>
        </div>
        <div className={styles.summary}>
          <Summary text={text} setText={setText} selectedItems={selectedItems} />
          {loading ? null : !tempUser || (tempUser && tempUser.recipesGenerated < 5) || user ? (
            (user && !user?.premium && user!.recipesGenerated < 20) ||
            (tempUser && tempUser.recipesGenerated < 5) ||
            (user && !user?.premium) ? (
              <Button
                text="Create recipe"
                onClick={createRecipe}
                loading={loadingRecipe}
                loadingText="Creating recipe"
                icon={<img src={WhiteLogo} alt="black_logo" />}
                disabled={!canCreateRecipe()}
              />
            ) : (
              <span>
                You reached the 20 recipes limit for free users.{' '}
                <Link to="/plans">Upgrade to continue creating delicious recipes</Link>
              </span>
            )
          ) : (
            <span>
              You reached the 5 recipes limit for non-users.{' '}
              <Link to="/auth">Log in or create your account to continue creating delicious recipes</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
