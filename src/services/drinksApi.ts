import {
  NAME_KEY,
  FILTER_CATEGORIES_KEY,
  RANDOM,
  ID_KEY,
  CATEGORIES_KEY_VALUE,
  INGREDIENTS_KEY_VALUE,
  searchOptions
} from './baseSearchOptions';

import { iGlobalRecipe, iSearchOptions, tCategories, iDrinkIngredient } from '../@types/apiTypes';

const baseURL = 'https://www.thecocktaildb.com/api/json/v1';

async function getDrinkData(urlToFetch: string): Promise<any> {
  const data = await fetch(urlToFetch);
  const { drinks } = await data.json();

  return drinks;
}

export async function fetchDrinksSearch({ option, value, token }: iSearchOptions): Promise<iGlobalRecipe[]> {
  const searchKey = searchOptions[option];
  const urlToFetch = `${baseURL}/${token}/${searchKey}=${value}`;

  const drinks = await getDrinkData(urlToFetch)

  return drinks || [];
}

export async function fetchDrinkRecommendations(token: string): Promise<iGlobalRecipe[]> {
  const urlToFetch = `${baseURL}/${token}/${NAME_KEY}=`;

  const drinks = await getDrinkData(urlToFetch)

  const recommendations = drinks as iGlobalRecipe[];

  const REC_LIMIT = 6;
  const toDisplayRecommendations = recommendations.filter((_, index) => index < REC_LIMIT);

  return toDisplayRecommendations || [];
}

function parseCategoriesNames(categories: tCategories): string[] {
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

export async function fetchDrinksCategories(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${CATEGORIES_KEY_VALUE}`;

  const drinks = await getDrinkData(urlToFetch)

  const categories = drinks as tCategories;

  const categoriesList = parseCategoriesNames(categories)

  return categoriesList;
}

function curateCategory(category: string): string {
  let curatedCategory = category;

  if (curatedCategory.match('Other')) {
    curatedCategory = 'Other/Unknown';
  }

  return curatedCategory;
}

export async function fetchDrinksByCategory(category: string, token: string): Promise<iGlobalRecipe[]> {
  const curatedCategory = curateCategory(category);

  const urlToFetch = `${baseURL}/${token}/${FILTER_CATEGORIES_KEY}=${curatedCategory}`;

  const drinks = await getDrinkData(urlToFetch)

  return drinks || [];
}

export async function fetchDrinkDetails(drinkID: string, token: string): Promise<iGlobalRecipe> {
  const urlToFetch = `${baseURL}/${token}/${ID_KEY}=${drinkID}`;

  const drinks = await getDrinkData(urlToFetch)

  const drinkDetails = drinks[0];

  return drinkDetails;
}

export async function fetchRandomDrink(token: string): Promise<[string, iGlobalRecipe]> {
  const urlToFetch = `${baseURL}/${token}/${RANDOM}`;

  const drinks = await getDrinkData(urlToFetch)

  const randomDrink = drinks[0];
  const { idDrink } = randomDrink;

  return [idDrink, randomDrink];
}

function parseIngredientNames(ingredients: iDrinkIngredient[]): string[] {
  const ingredientNames = ingredients.map((ingredient) => {
    const ingredientNameKey = 'strIngredient1';

    const ingredientName = ingredient[ingredientNameKey];

    return ingredientName;
  });

  return ingredientNames;
}

export async function fetchDrinkIngredients(token: string): Promise<string[]> {
  const urlToFetch = `${baseURL}/${token}/${INGREDIENTS_KEY_VALUE}`;

  const drinks = await getDrinkData(urlToFetch)

  const ingredients = drinks as iDrinkIngredient[];

  const ingredientNames = parseIngredientNames(ingredients);

  return ingredientNames;
}
