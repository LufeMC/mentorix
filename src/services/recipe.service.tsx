import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { ApiResponse, api } from './api.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';

const collectionRef = 'recipes';
let retrievingRecipe = false;

const createRecipe = async (text: string, firestore: Firestore) => {
  const response = await api.post<ApiResponse<Recipe>>('recipe', { text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipe: any = response.data;
  const recipeId = uuidv4();
  recipe.shareId = uuidv4();

  await setDoc(doc(firestore, collectionRef, recipeId), recipe);
  recipe.id = recipeId;

  return recipe as Recipe;
};

const getRecipeById = async (firestore: Firestore, recipeId: string): Promise<Recipe | string | undefined> => {
  if (!retrievingRecipe) {
    retrievingRecipe = true;
    const recipesRef = doc(firestore, collectionRef, recipeId);
    const recipeSnap = await getDoc(recipesRef);

    if (recipeSnap.exists()) {
      const recipe = recipeSnap.data() as Recipe;
      recipe.id = recipeSnap.id;
      return recipe;
    } else {
      return "This recipe doesn't exist";
    }
  }

  retrievingRecipe = false;

  return;
};

const getRecipes = async (firestore: Firestore, user: User): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];

  for (const recipe of user.recipes) {
    const retrievedRecipe = await getRecipeById(firestore, recipe);
    if (typeof retrievedRecipe !== 'string' && typeof retrievedRecipe !== 'undefined') {
      recipes.push(retrievedRecipe);
    }
  }

  return recipes;
};

const RecipeService = {
  createRecipe,
  getRecipeById,
  getRecipes,
};

export default RecipeService;
