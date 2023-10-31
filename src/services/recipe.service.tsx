import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Recipe, RecipeOptions } from '../types/recipe';
import { ApiResponse, api } from './api.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/user';
import UserService from './user.service';
import { copyOrShareText } from '../utils/share';
import { alertTypes } from '../stores/alertStore';

const collectionRef = 'recipes';
let retrievingRecipe = false;

const createRecipe = async (
  text: string,
  recipePreferences: RecipeOptions,
  firestore: Firestore,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  recipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  communityRecipes: Recipe[],
  setCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  todayCommunityRecipes: Recipe[],
  setTodayCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
) => {
  const response = await api.post<ApiResponse<Recipe>>('recipe', {
    text,
    userId: user?.id,
  });

  const recipe: Recipe = response.data as unknown as Recipe;
  const recipeId = uuidv4();
  recipe.shareId = uuidv4();
  recipe.creatorId = user?.id as string;
  recipe.mealType = recipePreferences.mealType[0] ?? '';
  recipe.cuisine = recipePreferences.cuisine[0] ?? '';
  recipe.servings = recipePreferences.servings[0] ?? '';
  recipe.dietRestrictions = recipePreferences.dietRestrictions;
  recipe.likes = [user!.id as string];
  recipe.img = recipe.img[0];
  recipe.createdAt = Date.now();

  await setDoc(doc(firestore, collectionRef, recipeId), recipe);

  if (user) {
    const userCopy = structuredClone(user) as User;
    await UserService.updateUser(
      firestore,
      { ...userCopy, recipes: [...userCopy.recipes, recipeId], recipesGenerated: userCopy.recipesGenerated + 1 },
      setUser,
    );
    recipe.creator = userCopy;
    setRecipes([...recipes, recipe]);

    if (communityRecipes.length < 12) {
      setCommunityRecipes([...communityRecipes, recipe]);
    }

    if (todayCommunityRecipes.length < 1) {
      setTodayCommunityRecipes([recipe]);
    }
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

const getRecipes = async (firestore: Firestore, user: User, page = 1): Promise<Recipe[]> => {
  const recipes: Recipe[] = [];
  const slice = user.recipes.slice((page - 1) * 12, page * 12 + 1);

  for (const recipe of slice) {
    const retrievedRecipe = await getRecipeById(firestore, recipe);
    if (typeof retrievedRecipe !== 'string' && typeof retrievedRecipe !== 'undefined') {
      if (retrievedRecipe.creatorId === user.id) {
        retrievedRecipe.creator = user;
      } else {
        const creator = await UserService.getUser(firestore, retrievedRecipe.creatorId as string);
        if (typeof creator !== 'string') {
          retrievedRecipe.creator = creator;
        }
      }

      recipes.push(retrievedRecipe);
    }
  }

  return recipes;
};

const getTodaysCommunityRecipes = async (firestore: Firestore) => {
  const todayCommunityRecipes: Recipe[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to the start of the day (midnight)
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const recipesRef = collection(firestore, collectionRef);

  const qToday = query(
    recipesRef,
    where('createdAt', '>=', today.getTime()),
    where('createdAt', '<=', endOfDay.getTime()),
  );

  const querySnapshotToday = await getDocs(qToday);

  if (!querySnapshotToday.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryRecipes = querySnapshotToday.docs.map((doc: any) => doc.data() as unknown as Recipe);
    queryRecipes.sort((a, b) => b.likes.length - a.likes.length);

    // Get the top 3 liked recipes created today
    const top3LikesToday = queryRecipes.slice(0, 3);
    for (const recipe of top3LikesToday) {
      const newRecipe = recipe as Recipe;
      newRecipe.id = recipe.id;
      const creator = await UserService.getUser(firestore, newRecipe.creatorId as string);

      if (typeof creator !== 'string') {
        newRecipe.creator = creator;

        todayCommunityRecipes.push(newRecipe);
      }
    }
  }

  return todayCommunityRecipes;
};

const getCommunityRecipes = async (
  firestore: Firestore,
  page = 1,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastSnapshot: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ todayCommunityRecipes: Recipe[] | null; communityRecipes: Recipe[]; newSnapshot: any }> => {
  const communityRecipes: Recipe[] = [];

  const recipesRef = collection(firestore, collectionRef);
  let snapshot;
  let q;

  if (lastSnapshot) {
    q = query(recipesRef, orderBy('likes', 'desc'), startAfter(lastSnapshot), limit(11));
  } else {
    q = query(recipesRef, orderBy('likes', 'desc'), limit(13));
  }
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    snapshot = querySnapshot.docs[querySnapshot.docs.length - 1];
    for (const recipe of querySnapshot.docs) {
      const newRecipe = recipe.data() as Recipe;
      newRecipe.id = recipe.id;
      const creator = await UserService.getUser(firestore, newRecipe.creatorId as string);

      if (typeof creator !== 'string') {
        newRecipe.creator = creator;

        communityRecipes.push(newRecipe);
      }
    }
  }

  let todayCommunityRecipes = null;

  if (page === 1) {
    todayCommunityRecipes = await getTodaysCommunityRecipes(firestore);
  }

  return { todayCommunityRecipes, communityRecipes, newSnapshot: snapshot };
};

const bookmarkRecipe = async (
  firestore: Firestore,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  recipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  recipe?: Recipe,
) => {
  const currentUser = structuredClone(user);
  if (currentUser && recipe) {
    currentUser.recipes.push(recipe!.id);
    UserService.updateUser(firestore, currentUser, setUser);
    setRecipes([...recipes, recipe]);
  }
};

const unBookmarkRecipe = async (
  firestore: Firestore,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  recipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  recipe?: Recipe,
) => {
  const currentUser = structuredClone(user);
  if (currentUser) {
    currentUser.recipes = currentUser.recipes.filter((recipeId) => recipeId !== recipe!.id);
    UserService.updateUser(firestore, currentUser, setUser);
    setRecipes(recipes.filter((currentRecipe) => currentRecipe.id !== recipe?.id));
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

const likeRecipe = async (
  firestore: Firestore,
  user: User,
  recipe: Recipe,
  recipes: Recipe[],
  communityRecipes: Recipe[],
  todaysCommunityRecipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  setCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  setTodayCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRecipe: any = structuredClone(recipe);
  const newLikes: string[] = [...new Set([...newRecipe.likes, user.id as string])];
  newRecipe.likes = newLikes;
  delete newRecipe.id;
  delete newRecipe.creator;

  await updateDoc(doc(firestore, collectionRef, recipe.id), newRecipe);
  setRecipes(
    recipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  setCommunityRecipes(
    communityRecipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  setTodayCommunityRecipes(
    todaysCommunityRecipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  return { ...recipe, ...newRecipe };
};

const unlikeRecipe = async (
  firestore: Firestore,
  user: User,
  recipe: Recipe,
  recipes: Recipe[],
  communityRecipes: Recipe[],
  todaysCommunityRecipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  setCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  setTodayCommunityRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRecipe: any = structuredClone(recipe);
  const newLikes: string[] = newRecipe.likes.filter((like: string) => like !== user.id);
  newRecipe.likes = newLikes;
  delete newRecipe.id;
  delete newRecipe.creator;

  await updateDoc(doc(firestore, collectionRef, recipe.id), newRecipe);
  setRecipes(
    recipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  setCommunityRecipes(
    communityRecipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  setTodayCommunityRecipes(
    todaysCommunityRecipes.map((recipeRef) => {
      if (recipeRef.id === recipe.id) {
        recipeRef.likes = newLikes;
      }

      return recipeRef;
    }),
  );

  return { ...recipe, ...newRecipe };
};

const RecipeService = {
  createRecipe,
  getRecipeById,
  getRecipes,
  getCommunityRecipes,
  bookmarkRecipe,
  unBookmarkRecipe,
  shareRecipe,
  likeRecipe,
  unlikeRecipe,
};

export default RecipeService;
