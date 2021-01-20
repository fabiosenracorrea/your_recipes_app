import {
NAME_KEY,
FILTER_CATEGORIES_KEY,
FILTER_AREA_KEY,
RANDOM,
ID_KEY,
CATEGORIES_KEY_VALUE,
AREA_KEY_VALUE,
INGREDIENTS_KEY_VALUE,
searchOptions
} from './baseSearchOptions';

import { iGlobalRecipe, iMealIngredient, tAreas, tCategories, iSearchOptions } from '../@types/apiTypes';

const baseURL = 'https://www.themealdb.com/api/json/v1';

async function getMealData(urlToFetch: string): Promise<any> {
  const data = await fetch(urlToFetch);
  const { meals } = await data.json();

  return meals;
}

export async function fetchMealsSearch({ option, value, token }: iSearchOptions): Promise<iGlobalRecipe[]> {
  const searchKey = searchOptions[option];
  const urlToFetch = `${baseURL}/${token}/${searchKey}=${value}`;

  const meals = await getMealData(urlToFetch);

  return meals || [];
}

export async function fetchFoodRecommendations(token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${NAME_KEY}=`;

  const meals = await getMealData(urlToFetch);

  const recommendations = meals as iGlobalRecipe[];

  const REC_LIMIT = 6;
  const toDisplayRecommendations = recommendations.filter((_, index) => index < REC_LIMIT);

  return toDisplayRecommendations || [];
}

export async function fetchFoodsCategories(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${CATEGORIES_KEY_VALUE}`;

  const meals = await getMealData(urlToFetch);

  const categories = meals as tCategories;

  const categoriesList = categories.map((category) => category.strCategory);

  return categoriesList;
}

export async function fetchMealsByCategory(category: string, token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${FILTER_CATEGORIES_KEY}=${category}`;

  const meals = await getMealData(urlToFetch);

  return meals || [];
}

export async function fetchMealDetails(mealID: string, token: string): Promise<iGlobalRecipe> {
  const urlToFetch = `${baseURL}/${token}/${ID_KEY}=${mealID}`;

  const meals = await getMealData(urlToFetch);

  const mealDetails = meals[0];

  return mealDetails;
}

export async function fetchRandomMeal(token: string): Promise<[string, iGlobalRecipe]> {
  const urlToFetch = `${baseURL}/${token}/${RANDOM}`;

  const meals = await getMealData(urlToFetch);

  const randomMeal = meals[0];
  const { idMeal } = randomMeal;

  return [idMeal, randomMeal];
}

function parseIngredientNames(ingredients: iMealIngredient[]): string[] {
  const ingredientNames = ingredients.map((ingredient) => {
    const ingredientNameKey = 'strIngredient';

    const ingredientName = ingredient[ingredientNameKey];

    return ingredientName;
  });

  return ingredientNames;
}

export async function fetchMealIngredients(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${INGREDIENTS_KEY_VALUE}`;

  const meals = await getMealData(urlToFetch);

  const ingredients = meals as iMealIngredient[];

  const ingredientNames = parseIngredientNames(ingredients)

  return ingredientNames;
}

export async function fetchFoodAreas(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${AREA_KEY_VALUE}`;

  const meals = await getMealData(urlToFetch);

  const areas = meals as tAreas;

  const areaNames = areas.map((area) => area.strArea);

  return areaNames;
}

export async function fetchFoodsByArea(area: string, token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${FILTER_AREA_KEY}=${area}`;

  const meals = await getMealData(urlToFetch);

  return meals || [];
}
