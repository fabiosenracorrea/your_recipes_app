import getIngredientUrl from '../../pages/ExploreIngredients/utils/ingredientImageUrl';

import mealIngredients from '../../fakes/mocks_copy/mealIngredients';
import drinkIngredients from '../../fakes/mocks_copy/drinkIngredients';

const mealIngredientNames = mealIngredients.meals.map((ing) => ing.strIngredient);
const drinkIngredientNames = drinkIngredients.drinks.map((drk) => drk.strIngredient1);

describe('getIngredientUrl function testing', () => {
  it('should correctly return meal ingredients url', () => {
    const mealType = 'meals';

    mealIngredientNames.forEach((ingredient) => {
      const expectedMealIngUrl = `https://www.themealdb.com/images/ingredients/${ingredient}.png`;

      const url = getIngredientUrl(mealType, ingredient);

      expect(url).toBe(expectedMealIngUrl);
    });
  });

  it('should correctly return drink ingredients url', () => {
    const drinkType = 'cocktails';

    drinkIngredientNames.forEach((ingredient) => {
      const expectedMealIngUrl = `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;

      const url = getIngredientUrl(drinkType, ingredient);

      expect(url).toBe(expectedMealIngUrl);
    });
  });

  it('should return undefined on any other type, cap-sensitive and typos included', () => {
    const typos = [
      'cocktail', 'Cocktails', 'cocktai', 'meal', 'MEALS', 'Meals', 'wrong',
    ];

    const fakeIngredient = mealIngredientNames[0];

    typos.forEach((typo) => {
      const url = getIngredientUrl(typo, fakeIngredient);

      expect(url).toBeUndefined();
    });
  });
});
