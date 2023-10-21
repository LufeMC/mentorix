export type Recipe = {
  id: string;
  title: string;
  preparationTime: number;
  cookingTime: number;
  ingredients: string[];
  instructions: string[];
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
