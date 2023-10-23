import { ChangeEvent, useContext, useMemo, useState } from 'react';
import styles from './HomePage.module.scss';
import HomeSection from './components/section/HomeSection';
import HomeItem from './components/item/HomeItem';
import { RecipeFilters, RecipeOptions } from '../../../types/recipe';
import DietRestrictions from '../../../assets/jsons/dietRestrictions.json';
import Cuisines from '../../../assets/jsons/cuisine.json';
import Ingredients from '../../../assets/jsons/ingredients.json';
import { capitalizeWordsInArray, jsxElementToStringWithWhitespace } from '../../../utils/string';
import useUserStore from '../../../stores/userStore';
import Summary from './components/summary/Summary';
import Button from '../../../components/button/Button';
import WhiteLogo from '../../../assets/img/logo-white.svg';
import RecipeService from '../../../services/recipe.service';
import { FirebaseContext } from '../../../contexts/firebase-context';
import { useNavigate } from 'react-router-dom';
import useRecipesStore from '../../../stores/recipesStore';

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
  const userStore = useUserStore();
  const recipesStore = useRecipesStore();
  const firebaseContext = useContext(FirebaseContext);
  const navigate = useNavigate();
  const rawOptions = useMemo<RecipeOptions>(() => initialOptions, []);

  const [isError, setIsError] = useState<boolean>(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
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
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(false);

  const addOrRemoveItem = (itemName: string, category: string, add: boolean, allowMultile: boolean) => {
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
    if (!loadingRecipe) {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      setLoadingRecipe(true);
      recipesStore.createRecipe();
      const formattedText = jsxElementToStringWithWhitespace(text);
      try {
        const recipe = await RecipeService.createRecipe(formattedText, firebaseContext.firestore);
        window.sessionStorage.setItem('recipeGenerated', recipe.id);
        navigate(`/recipes/${recipe.id}`);
      } catch (err) {
        setIsError(true);
        setErrorTimeout(
          setTimeout(() => {
            setIsError(false);
          }, 5000),
        );
      } finally {
        setLoadingRecipe(false);
        recipesStore.finishCreateRecipe();
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
      <h1>Welcome{userStore.user ? `, ${userStore.user.name}!` : '!'} What are we cooking today?</h1>
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
          {isError && <span>An error occured. Try again later</span>}
          <Button
            text="Create recipe"
            onClick={createRecipe}
            loading={loadingRecipe}
            loadingText="Creating recipe"
            icon={<img src={WhiteLogo} alt="black_logo" />}
            disabled={!canCreateRecipe()}
          />
        </div>
      </div>
    </div>
  );
}
