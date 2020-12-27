import { iGlobalRecipe } from '../@types/apiTypes';

const baseURL = 'https://www.themealdb.com/api/json/v1';
// const searchBase = 'search.php?';

const NAME_KEY = 'search.php?s'; // search bar
const FIRST_LETTER_KEY = 'search.php?f'; // search bar
const FILTER_INGREDIENTS_KEY = 'filter.php?i'; // search bar
const FILTER_CATEGORIES_KEY = 'filter.php?c';
const FILTER_AREA_KEY = 'filter.php?a';
const RANDOM = 'random.php';

const ID_KEY = 'lookup.php?i';

const CATEGORIES_KEY_VALUE = 'list.php?c=list';
const AREA_KEY_VALUE = 'list.php?a=list';
const INGREDIENTS_KEY_VALUE = 'list.php?i=list';

export const searchOptions = {
  name: NAME_KEY,
  first_letter: FIRST_LETTER_KEY,
  ingredients: FILTER_INGREDIENTS_KEY,
};

interface iMealSearchOptions {
  option: keyof typeof searchOptions;
  value: string;
  token: string;
}

type tAreas = Array<{ strArea: string }>;

type tCategories = Array<{ strCategory: string }>;

interface iIngredients {
  strIngredient: string;
  idIngredient: string;
  strDescription: string;
}

export async function fetchMealsSearch({ option, value, token }: iMealSearchOptions): Promise<iGlobalRecipe[]> {
  const searchKey = searchOptions[option];
  const urlToFetch = `${baseURL}/${token}/${searchKey}=${value}`;

  const data = await fetch(urlToFetch);

  const { meals } = await data.json();

  return meals || [];
}

export async function fetchFoodRecommendations(token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${NAME_KEY}=`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  const recommendations = meals as iGlobalRecipe[];

  const REC_LIMIT = 6;
  const toDisplayRecommendations = recommendations.filter((_, index) => index < REC_LIMIT);

  return toDisplayRecommendations || [];
}

export async function fetchFoodsCategories(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${CATEGORIES_KEY_VALUE}`;

  const data = await fetch(urlToFetch);

  const { meals } = await data.json();

  const categories = meals as tCategories;

  const categoriesList = categories.map((category) => category.strCategory);

  return categoriesList;
}

export async function fetchMealsByCategory(category: string, token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${FILTER_CATEGORIES_KEY}=${category}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  return meals || [];
}

export async function fetchMealDetails(mealID: string, token: string): Promise<iGlobalRecipe> {
  const urlToFetch = `${baseURL}/${token}/${ID_KEY}=${mealID}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  const mealDetails = meals[0];

  return mealDetails;
}

export async function fetchRandomMeal(token: string): Promise<[string, iGlobalRecipe]> {
  const urlToFetch = `${baseURL}/${token}/${RANDOM}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  const randomMeal = meals[0];
  const { idMeal } = randomMeal;

  return [idMeal, randomMeal];
}

export async function fetchMealIngredients(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${INGREDIENTS_KEY_VALUE}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  const ingredients = meals as iIngredients[];

  const ingredientNames = ingredients.map((ingredient) => {
    const ingredientNameKey = 'strIngredient';

    const ingredientName = ingredient[ingredientNameKey];

    return ingredientName;
  });

  return ingredientNames;
}

export async function fetchFoodAreas(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${AREA_KEY_VALUE}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  const areas = meals as tAreas;

  const areaNames = areas.map((area) => area.strArea);

  return areaNames;
}

export async function fetchFoodsByArea(area: string, token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${FILTER_AREA_KEY}=${area}`;

  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  return meals || [];
}
