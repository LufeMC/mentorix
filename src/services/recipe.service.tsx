import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { ApiResponse, api } from './api.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';
import UserService from './user.service';
import { UserActions, UserState } from '../stores/userStore';
import { RecipesActions } from '../stores/recipesStore';
import { copyOrShareText } from '../utils/share';
import { alertTypes } from '../stores/alertStore';

const collectionRef = 'recipes';
let retrievingRecipe = false;

const createRecipe = async (text: string, firestore: Firestore, userStore?: UserState | UserActions) => {
  const response = await api.post<ApiResponse<Recipe>>('recipe', { text });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipe: any = response.data;
  const recipeId = uuidv4();
  recipe.shareId = uuidv4();

  await setDoc(doc(firestore, collectionRef, recipeId), recipe);

  if (userStore && (userStore as UserState).user) {
    const userCopy = structuredClone((userStore as UserState).user) as User;
    await UserService.updateUser(
      firestore,
      { ...userCopy, recipesGenerated: userCopy.recipesGenerated + 1 },
      userStore as UserActions,
    );
  }

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
      retrievingRecipe = false;
      return recipe;
    } else {
      retrievingRecipe = false;
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

const bookmarkRecipe = async (
  firestore: Firestore,
  userStore: UserState | UserActions,
  recipesStore: RecipesActions,
  newRecipe?: Recipe,
  recipe?: Recipe,
) => {
  const currentUser = structuredClone((userStore as UserState).user);
  if (currentUser) {
    currentUser.recipes.push(newRecipe ? newRecipe.id : recipe!.id);
    UserService.updateUser(firestore, currentUser, userStore as UserActions);
    recipesStore.addRecipe(newRecipe ? newRecipe : (recipe as Recipe));
  }
};

const unBookmarkRecipe = async (
  firestore: Firestore,
  userStore: UserState | UserActions,
  recipesStore: RecipesActions,
  recipe?: Recipe,
) => {
  const currentUser = structuredClone((userStore as UserState).user);
  if (currentUser) {
    currentUser.recipes = currentUser.recipes.filter((recipeId) => recipeId !== recipe!.id);
    UserService.updateUser(firestore, currentUser, userStore as UserActions);
    recipesStore.removeRecipe(recipe!.id);
  }
};

const shareRecipe = (
  alertHandler: (_text: string, _type: keyof typeof alertTypes) => void,
  newRecipe?: Recipe,
  recipe?: Recipe,
) => {
  copyOrShareText(
    `Check out the recipe for ${newRecipe ? newRecipe.title : recipe?.title}:\n${window.location.href}/${
      newRecipe ? newRecipe.shareId : recipe?.shareId
    }\nTo create more recipes like this, visit https://cookii.io`,
    alertHandler,
  );
};

const RecipeService = {
  createRecipe,
  getRecipeById,
  getRecipes,
  bookmarkRecipe,
  unBookmarkRecipe,
  shareRecipe,
};

export default RecipeService;
