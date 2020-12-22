import { tRecipeTypes } from '../../../@types/appTypes';

function getIngredientUrl(type: tRecipeTypes, ingredient: string): string | undefined {
  switch (type) {
  case 'meals':
    return `https://www.themealdb.com/images/ingredients/${ingredient}.png`;
  case 'cocktails':
    return `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;
  default:
  }
}

export default getIngredientUrl;
