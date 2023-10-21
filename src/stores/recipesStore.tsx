import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Recipe } from '../types/recipe';

interface RecipesState {
  recipes: Recipe[];
  addRecipe: (_newRecipe: Recipe) => void;
  removeRecipe: (_recipeId: string) => void;
}

const useRecipesStore = create<RecipesState>()(
  devtools(
    persist(
      (set) => ({
        recipes: [],
        addRecipe: (newRecipe: Recipe) => set((state) => ({ recipes: [...state.recipes, newRecipe] })),
        removeRecipe: (recipeId: string) =>
          set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== recipeId) })),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useRecipesStore;
