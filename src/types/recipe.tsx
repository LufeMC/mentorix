import { User } from './user';

export type Recipe = {
  id: string;
  title: string;
  cookingTime: number;
  ingredients: Ingredient[];
  instructions: string[];
  shareId: string;
  mealType: string;
  cuisine: string;
  servings: string;
  dietRestrictions: string[];
  likes: string[];
  img: string;
  creatorId: string;
  createdAt: number;
  creator?: User;
};

type Ingredient = {
  ingredient: string;
  quantity: string;
};

export type RecipeOptions = {
  servings: string[];
  dietRestrictions: string[];
  cuisine: string[];
  mealType: string[];
  ingredients: string[];
  carbs?: number | string;
  protein?: number | string;
  fat?: number | string;
  additionalDetails?: string;
};

export type RecipeFilters = {
  dietRestrictions: string;
  cuisine: string;
  ingredients: string;
};

export const recipeRedirects = {
  share: 'share',
  bookmark: 'bookmark',
};
