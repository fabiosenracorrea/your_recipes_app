import { iMeal } from '../../@types/apiTypes';

const oneMeal = {
  meals: [
    {
      idMeal: '52771',
      strMeal: 'Spicy Arrabiata Penne',
      strDrinkAlternate: null,
      strCategory: 'Vegetarian',
      strArea: 'Italian',
      strInstructions: 'Bring a large pot of water to a boil. Add kosher salt to the boiling water, then add the pasta. Cook according to the package instructions, about 9 minutes.\r\nIn a large skillet over medium-high heat, add the olive oil and heat until the oil starts to shimmer. Add the garlic and cook, stirring, until fragrant, 1 to 2 minutes. Add the chopped tomatoes, red chile flakes, Italian seasoning and salt and pepper to taste. Bring to a boil and cook for 5 minutes. Remove from the heat and add the chopped basil.\r\nDrain the pasta and add it to the sauce. Garnish with Parmigiano-Reggiano flakes and more basil and serve warm.',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      strTags: 'Pasta,Curry',
      strYoutube: 'https://www.youtube.com/watch?v=1IszT_guI08',
      strIngredient1: 'penne rigate',
      strIngredient2: 'olive oil',
      strIngredient3: 'garlic',
      strIngredient4: 'chopped tomatoes',
      strIngredient5: 'red chile flakes',
      strIngredient6: 'italian seasoning',
      strIngredient7: 'basil',
      strIngredient8: 'Parmigiano-Reggiano',
      strIngredient9: '',
      strIngredient10: '',
      strIngredient11: '',
      strIngredient12: '',
      strIngredient13: '',
      strIngredient14: '',
      strIngredient15: '',
      strIngredient16: null,
      strIngredient17: null,
      strIngredient18: null,
      strIngredient19: null,
      strIngredient20: null,
      strMeasure1: '1 pound',
      strMeasure2: '1/4 cup',
      strMeasure3: '3 cloves',
      strMeasure4: '1 tin',
      strMeasure5: '1/2 teaspoon',
      strMeasure6: '1/2 teaspoon',
      strMeasure7: '6 leaves',
      strMeasure8: 'spinkling',
      strMeasure9: '',
      strMeasure10: '',
      strMeasure11: '',
      strMeasure12: '',
      strMeasure13: '',
      strMeasure14: '',
      strMeasure15: '',
      strMeasure16: null,
      strMeasure17: null,
      strMeasure18: null,
      strMeasure19: null,
      strMeasure20: null,
      strSource: null,
      dateModified: null,
    },
  ],
};

const meal = oneMeal.meals[0]

export const mealIngredientsAndMeasure = (
  (Object.keys(meal) as Array<keyof iMeal>)
    .filter((detail) => {
      const ingredientPattern = /strIngredient\d/i;

      const detailIsIngredient = (
        ingredientPattern.test(detail)
      );


      // makes sure we only have filled ingredients
      if (detailIsIngredient) {
        return meal[detail];
      }

      return false;
    })
    .map((ingredientKey) => {
      const everyNonDigitChar = /[^\d]/g;
      const ingredientNumber = ingredientKey.replace(everyNonDigitChar, '');

      const matchingMeasure = `strMeasure${ingredientNumber}` as keyof iMeal;

      const ingredient = meal[ingredientKey];
      const measure = meal[matchingMeasure];

      const displayFormat = `${ingredient} - ${measure}`;

      return displayFormat;
    })
);

export default oneMeal;
