import { iGlobalRecipe } from '../@types/apiTypes';

function parseIngredientAndMeasures(recipe: iGlobalRecipe): string[] {
  const parsedIngredients = (
    (Object.keys(recipe) as Array<keyof iGlobalRecipe>)
      .filter((detail) => {
        const ingredientPattern = /strIngredient\d/i;

        const detailIsIngredient = (
          ingredientPattern.test(detail)
        );

        // makes sure we only have filled ingredients
        if (detailIsIngredient) {
          return recipe[detail];
        }

        return false;
      })
      .map((ingredientKey) => {
        const everyNonDigitChar = /[^\d]/g;
        const ingredientNumber = ingredientKey.replace(everyNonDigitChar, '');

        const matchingMeasure = `strMeasure${ingredientNumber}` as keyof iGlobalRecipe;

        const ingredient = recipe[ingredientKey];
        const measure = recipe[matchingMeasure];

        const displayFormat = `${ingredient} - ${measure}`;

        return displayFormat;
      })
  );

  return parsedIngredients;
}

export default parseIngredientAndMeasures;
