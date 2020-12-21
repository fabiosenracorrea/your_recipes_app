import { iDrink, iMeal } from './apiTypes';

export type tRecipeTypes = 'meals' | 'cocktails';

type iRecipes = iDrink | iMeal;

export type iRecipeOptions = iRecipes & {
  strMealThumb?: string;
  strDrinkThumb?: string;
  strAlcoholic?: string;
  idDrink?: string;

  strMeal?: string;
  strDrink?: string;
  idMeal?: string;
  strArea?:string;
  strTags?: string;
  strYoutube?: string;

  strCategory?: string;
  strInstructions?: string;
}

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

export interface iSearchOptions {
  option: 'name' | 'first_letter' | 'ingredients';
  value: string;
  token: string;
}
