import { iGlobalRecipe, iMeal, iDrink } from '../../@types/apiTypes';
import { tRecipeTypes, iDoneRecipe } from '../../@types/appTypes';

function extractRecipeInfo(
  type: tRecipeTypes,
  recipe: iGlobalRecipe,
): Omit<iDoneRecipe, 'doneDate'> {
  if (type === 'meals') {
    const mealRecipe = recipe as iMeal;

    const {
      idMeal: id,
      strArea: area,
      strMeal: name,
      strCategory: category,
      strMealThumb: image,
      strTags: stringTags,
    } = mealRecipe;

    const alcoholicOrNot = '';

    const tags = (stringTags ? stringTags.split(',') : []);

    return {
      id,
      area: (area || ''),
      name,
      category: (category || ''),
      image,
      tags,
      alcoholicOrNot,
      type: 'meals',
    };
  }

  const drinkRecipe = recipe as iDrink;

  const {
    idDrink: id,
    strDrink: name,
    strCategory: category,
    strDrinkThumb: image,
    strTags: stringTags,
    strAlcoholic: alcoholicOrNot,
  } = drinkRecipe;

  const area = '';

  const tags = (stringTags ? stringTags.split(',') : []);

  return {
    id,
    area,
    name,
    category: (category || ''),
    image,
    tags,
    alcoholicOrNot,
    type: 'cocktails',
  };
}

function parseDateToDisplayFormat(rawDate: Date): string {
  const day = rawDate.getDate();
  const month = rawDate.getMonth() + 1; // JS months start at 0.
  const year = rawDate.getFullYear();

  const parsedDate = `${month}/${day}/${year}`;

  const [time] = rawDate.toTimeString().split(' ');
  const [hours, minutes] = time.split(':');
  const parsedTime = `${hours}:${minutes}`;

  const parsedDoneDate = `${parsedTime} - ${parsedDate}`;

  return parsedDoneDate;
}

export default function saveDoneRecipe(type: tRecipeTypes, recipe: iGlobalRecipe): iDoneRecipe[] {
  const potentiallySavedRecipes = localStorage.getItem('doneRecipes');

  let previouslyDoneRecipes = [];

  if (potentiallySavedRecipes) {
    previouslyDoneRecipes = JSON.parse(potentiallySavedRecipes);
  }

  const newRecipeInfoParsed = extractRecipeInfo(type, recipe);

  const date = new Date(Date.now());
  const doneDate = parseDateToDisplayFormat(date);

  const recipeToAdd = { ...newRecipeInfoParsed, doneDate };

  const newDoneRecipes = [...previouslyDoneRecipes, recipeToAdd];

  localStorage.setItem('doneRecipes', JSON.stringify(newDoneRecipes));

  return newDoneRecipes;
}
