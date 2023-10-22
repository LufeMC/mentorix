import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { ApiResponse, api } from './api.service';
import { v4 as uuidv4 } from 'uuid';
import UserService from './user.service';
import { UserState } from '../stores/userStore';

const collectionRef = 'recipes';
let retrievingRecipe = false;

const createRecipe = async (text: string, firestore: Firestore, userStore?: UserState) => {
  const response = await api.post<ApiResponse<Recipe>>('recipe', { text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipe: any = response.data;
  const recipeId = uuidv4();

  await setDoc(doc(firestore, collectionRef, recipeId), recipe);
  recipe.id = recipeId;

  if (userStore && userStore.user) {
    const userCopy = structuredClone(userStore.user);
    userCopy.recipes.push(recipe.id);
    await UserService.updateUser(firestore, userCopy);
    userStore.update(userCopy);
  }
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

const RecipeService = {
  createRecipe,
  getRecipeById,
};

export default RecipeService;
