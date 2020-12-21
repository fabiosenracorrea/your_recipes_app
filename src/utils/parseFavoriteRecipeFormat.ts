import { iGlobalRecipe } from '../@types/apiTypes';
import { tRecipeTypes, iFavoriteRecipe } from '../@types/appTypes';

function parseRecipeToFavorite(type: tRecipeTypes, recipe: iGlobalRecipe): iFavoriteRecipe {
  const favorite = {
    id: recipe.idDrink || recipe.idMeal,
    type: (type === 'meals') ? 'meals' : 'cocktails',
    area: recipe.strArea || '',
    category: recipe.strCategory,
    alcoholicOrNot: recipe.strAlcoholic || '',
    name: recipe.strDrink || recipe.strMeal,
    image: recipe.strDrinkThumb || recipe.strMealThumb,
  };

  return favorite;
}

export default parseRecipeToFavorite;
