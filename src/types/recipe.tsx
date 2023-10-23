export type Recipe = {
  id: string;
  title: string;
  preparationTime: number;
  cookingTime: number;
  ingredients: Ingredient[];
  instructions: string[];
  shareId: string;
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
