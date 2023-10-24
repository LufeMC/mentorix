import { Recipe } from '../types/recipe';
import { atom } from 'jotai';

export const RecipesAtom = atom<Recipe[]>([]);
export const LoadingRecipeAtom = atom<boolean>(false);
