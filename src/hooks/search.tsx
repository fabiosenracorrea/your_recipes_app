import React, { createContext, useCallback, useContext, useState } from 'react';

import { useRecipes } from './recipes';
import { useAuth } from './auth';

import { fetchMealsSearch } from '../services/foodApi';
import { fetchDrinksSearch } from '../services/drinksApi';

import { tRecipeTypes, iSearchOptions } from '../@types/appTypes';

const recipesIDAccess = {
  meals: 'idMeal',
  cocktails: 'idDrink',
};

type tRecipeID = 'idMeal' | 'idDrink';

const fetchSearchOptions = {
  meals: fetchMealsSearch,
  cocktails: fetchDrinksSearch,
};

interface iInfoSearched {
  meals: iSearchOptions;
  cocktails: iSearchOptions;
}

interface iSearchProviderProps {
  infoSearched: iInfoSearched;
  loadingRecipes: boolean;
  appSearch(type: tRecipeTypes, searchOptions: iSearchOptions): Promise<string | undefined>;
  updateSearch(type: tRecipeTypes, newSearchOptions: Omit<iSearchOptions, 'token'>): void;
}

export const initialSearchValues = {
  meals: {
    option: 'name',
    value: '',
    token: '1',
  },
  cocktails: {
    option: 'name',
    value: '',
    token: '1',
  },
} as iInfoSearched;

const searchContext = createContext<iSearchProviderProps>({} as iSearchProviderProps);

const SearchProvider: React.FC = ({ children }) => {
  const [infoSearched, setInfoSearched] = useState<iInfoSearched>(initialSearchValues);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const { updateRecipes } = useRecipes();
  const { userToken } = useAuth();

  const appSearch = useCallback(async (type: tRecipeTypes, { option, value, token }: iSearchOptions) => {
    setLoadingRecipes(true);

    const userSearch = { option, value, token };

    setInfoSearched((oldInfo) => ({
      ...oldInfo,
      [type]: userSearch,
    }));

    let firstItemID;

    try {
      const fetchRecipes = fetchSearchOptions[type];
      const recipesSearched = await fetchRecipes(userSearch);

      if (!recipesSearched.length) {
        alert("Sorry, we couldn't find any recipe with your search.");

        return;
      }

      const singleRecipeReturned = (recipesSearched.length === 1);

      if (singleRecipeReturned) {
        const firstItem = recipesSearched[0];
        const correctIDAccess = recipesIDAccess[type] as tRecipeID;
        firstItemID = firstItem[correctIDAccess];
      }

      updateRecipes(type, recipesSearched);

    } catch (err) {
      console.log(err);

      alert('An error happened when searching. Please try again.');
    } finally {
      setLoadingRecipes(false);
    }

    return firstItemID;
  }, [updateRecipes]);

  const updateSearch = useCallback((type: tRecipeTypes, { option, value }: Omit<iSearchOptions, 'token'>) => {
    const userSearch = { option, value, token: userToken };

    setInfoSearched((oldInfo) => ({
      ...oldInfo,
      [type]: userSearch,
    }));
  }, [userToken]);

  return (
    <searchContext.Provider
      value={ {
        appSearch, infoSearched, updateSearch, loadingRecipes,
      } }
    >
      {children}
    </searchContext.Provider>
  );
};

function useSearch(): iSearchProviderProps {
  const context = useContext(searchContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { SearchProvider, useSearch };
