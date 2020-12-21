export type tRecipeTypes = 'meals' | 'cocktails';

export interface iRecipeOptions {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strAlcoholic: string;

  strArea: string;
  strCategory: string;
  strTags: string;

  idMeal: string;
  strMeal: string;
  strMealThumb: string;
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
