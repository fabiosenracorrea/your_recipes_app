export type tRecipeTypes = 'meals' | 'cocktails';

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
