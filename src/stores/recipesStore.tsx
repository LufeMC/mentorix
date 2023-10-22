import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Recipe } from '../types/recipe';

interface RecipesState {
  recipes: Recipe[];
  creatingRecipe: boolean;
  createRecipe: () => void;
  finishCreateRecipe: () => void;
  addRecipe: (_newRecipe: Recipe) => void;
  removeRecipe: (_recipeId: string) => void;
  logout: () => void;
}

const useRecipesStore = create<RecipesState>()(
  devtools(
    persist(
      (set) => ({
        recipes: [],
        creatingRecipe: false,
        createRecipe: () => set(() => ({ creatingRecipe: true })),
        finishCreateRecipe: () => set(() => ({ creatingRecipe: false })),
        addRecipe: (newRecipe: Recipe) => set((state) => ({ recipes: [...state.recipes, newRecipe] })),
        removeRecipe: (recipeId: string) =>
          set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== recipeId) })),
        logout: () => set(() => ({ recipes: [] })),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useRecipesStore;
