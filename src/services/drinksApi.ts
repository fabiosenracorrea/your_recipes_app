import { iGlobalRecipe } from '../@types/apiTypes';

const baseURL = 'https://www.thecocktaildb.com/api/json/v1';

const NAME_KEY = 'search.php?s'; // search bar
const FIRST_LETTER_KEY = 'search.php?f'; // search bar
const FILTER_INGREDIENTS_KEY = 'filter.php?i'; // search bar
const FILTER_CATEGORIES_KEY = 'filter.php?c';
const RANDOM = 'random.php';

const ID_KEY = 'lookup.php?i';
// const INGREDIENTS_KEY = 'i';
// const AREA_KEY = 'f';

const CATEGORIES_KEY_VALUE = 'list.php?c=list';
// const AREA_KEY_VALUE = 'list.php?a=list';
const INGREDIENTS_KEY_VALUE = 'list.php?i=list';

export const searchOptions = {
  name: NAME_KEY,
  first_letter: FIRST_LETTER_KEY,
  ingredients: FILTER_INGREDIENTS_KEY,
};

interface iDrinkSearchOptions {
  option: keyof typeof searchOptions;
  value: string;
  token: string;
}

type tCategories = Array<{ strCategory: string }>;

interface iIngredients {
  strIngredient1: string;
  idIngredient: string;
  strDescription: string;
}

export async function fetchDrinksSearch({ option, value, token }: iDrinkSearchOptions): Promise<iGlobalRecipe[]> {
  const searchKey = searchOptions[option];
  const urlToFetch = `${baseURL}/${token}/${searchKey}=${value}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  return drinks || [];
}

export async function fetchDrinkRecommendations(token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${NAME_KEY}=`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  const recommendations = drinks as iGlobalRecipe[];

  const REC_LIMIT = 6;
  const toDisplayRecommendations = recommendations.filter((_, index) => index < REC_LIMIT);

  return toDisplayRecommendations || [];
}

export async function fetchDrinksCategories(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${CATEGORIES_KEY_VALUE}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  const categories = drinks as tCategories;

  const categoriesList = categories.map((category) => {
    let categoryName = category.strCategory;
    const unknownRegex = new RegExp('/unknown', 'i');

    if (unknownRegex.test(categoryName)) {
      categoryName = categoryName.replace(unknownRegex, '');
    }

    return categoryName;
  });

  return categoriesList;
}

export async function fetchDrinksByCategory(category: string, token: string): Promise<iGlobalRecipe[]> {
  let curatedCategory = category;

  if (curatedCategory.match('Other')) {
    curatedCategory = 'Other/Unknown';
  }

  const urlToFetch = `${baseURL}/${token}/${FILTER_CATEGORIES_KEY}=${curatedCategory}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  return drinks || [];
}

export async function fetchDrinkDetails(drinkID: string, token: string): Promise<iGlobalRecipe> {
  const urlToFetch = `${baseURL}/${token}/${ID_KEY}=${drinkID}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  const drinkDetails = drinks[0];

  return drinkDetails;
}

export async function fetchRandomDrink(token: string): Promise<[id: string, meal: iGlobalRecipe]> {
  const urlToFetch = `${baseURL}/${token}/${RANDOM}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  const randomDrink = drinks[0];
  const { idDrink } = randomDrink;

  return [idDrink, randomDrink];
}

export async function fetchDrinkIngredients(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${INGREDIENTS_KEY_VALUE}`;

  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  const ingredients = drinks as iIngredients[];

  const ingredientNames = ingredients.map((ingredient) => {
    const ingredientNameKey = 'strIngredient1';

    const ingredientName = ingredient[ingredientNameKey];

    return ingredientName;
  });

  return ingredientNames;
}
