import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Recipe } from '../types/recipe';

interface RecipesState {
  recipes: Recipe[];
  creatingRecipe: boolean;
}

export interface RecipesActions {
  createRecipe: () => void;
  finishCreateRecipe: () => void;
  changeRecipes: (_newRecipes: Recipe[]) => void;
  addRecipe: (_newRecipe: Recipe) => void;
  removeRecipe: (_recipeId: string) => void;
  logout: () => void;
}

const initialState: RecipesState = {
  recipes: [],
  creatingRecipe: false,
};

const useRecipesStore = create<RecipesState & RecipesActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        createRecipe: () => set(() => ({ creatingRecipe: true })),
        finishCreateRecipe: () => set(() => ({ creatingRecipe: false })),
        changeRecipes: (newRecipes: Recipe[]) => set(() => ({ recipes: newRecipes })),
        addRecipe: (newRecipe: Recipe) => set((state) => ({ recipes: [...state.recipes, newRecipe] })),
        removeRecipe: (recipeId: string) =>
          set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== recipeId) })),
        logout: () => set(initialState),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useRecipesStore;
