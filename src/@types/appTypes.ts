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
