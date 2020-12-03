import parseRecipeToFavorite from '../../utils/parseFavoriteRecipeFormat';

import oneMeal from '../../fakes/mocks_copy/oneMeal';
import oneDrink from '../../fakes/mocks_copy/oneDrink';

const mealToFavorite = oneMeal.meals[0];
const drinkToFavorite = oneDrink.drinks[0];

describe('Parse Recipe To Favorite test', () => {
  it('should parse and return the correct food structure', () => {
    const type = 'meals';

    const expected = {
      id: mealToFavorite.idMeal,
      type: 'meals',
      area: mealToFavorite.strArea,
      category: mealToFavorite.strCategory,
      alcoholicOrNot: '',
      name: mealToFavorite.strMeal,
      image: mealToFavorite.strMealThumb,
    };

    const parsedRecipe = parseRecipeToFavorite(type, mealToFavorite);

    expect(parsedRecipe).toStrictEqual(expected);
  });

  it('should parse and return the correct drink structure', () => {
    const type = 'cocktails';

    const expected = {
      id: drinkToFavorite.idDrink,
      type: 'cocktails',
      area: '',
      category: drinkToFavorite.strCategory,
      alcoholicOrNot: drinkToFavorite.strAlcoholic,
      name: drinkToFavorite.strDrink,
      image: drinkToFavorite.strDrinkThumb,
    };

    const parsedRecipe = parseRecipeToFavorite(type, drinkToFavorite);

    expect(parsedRecipe).toStrictEqual(expected);
  });
});
