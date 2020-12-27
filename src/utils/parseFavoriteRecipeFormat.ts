import { iGlobalRecipe, iDrink, iMeal } from '../@types/apiTypes';
import { tRecipeTypes, iFavoriteRecipe } from '../@types/appTypes';

function parseRecipeToFavorite(type: tRecipeTypes, recipe: iGlobalRecipe): iFavoriteRecipe {
  let favorite: iFavoriteRecipe;

  if (type === 'meals') {
    const mealRecipe = recipe as iMeal;

    favorite = {
      id: mealRecipe.idMeal,
      type: 'meals',
      area: mealRecipe.strArea,
      category: mealRecipe.strCategory,
      alcoholicOrNot: '',
      name: mealRecipe.strMeal,
      image: mealRecipe.strMealThumb,
    };
  } else {
    const drinkRecipe = recipe as iDrink;

    favorite = {
      id: drinkRecipe.idDrink,
      type: 'cocktails',
      area: '',
      category: drinkRecipe.strCategory,
      alcoholicOrNot: drinkRecipe.strAlcoholic,
      name: drinkRecipe.strDrink,
      image: drinkRecipe.strDrinkThumb,
    };
  }

  return favorite;
}

export default parseRecipeToFavorite;
