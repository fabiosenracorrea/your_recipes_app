import { iDrink, iMeal } from './apiTypes';

export type tRecipeTypes = 'meals' | 'cocktails';

export type iRecipeOptions = iDrink | iMeal;

export interface iFavoriteRecipe {
  id: string;
  type: string;
  area: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
}

export interface iDoneRecipe {
  id: string;
  area: string;
  name: string;
  category: string;
  image: string;
  tags: string[];
  alcoholicOrNot: string;
  type: tRecipeTypes;
  doneDate: string;
}
