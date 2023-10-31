import { Recipe } from '../types/recipe';
import { atom } from 'jotai';

export const RecipesAtom = atom<Recipe[]>([]);
export const IsThereMoreRecipesAtom = atom<boolean>(false);
export const RecipeAtom = atom<Recipe | null>(null);
export const LoadingRecipeAtom = atom<boolean>(false);

export const CommunityRecipesAtom = atom<Recipe[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LastCommunityRecipeSnapshotAtom = atom<any>(null);
export const IsThereMoreCommunityRecipesAtom = atom<boolean>(false);
export const TodayCommunityRecipesAtom = atom<Recipe[]>([]);
