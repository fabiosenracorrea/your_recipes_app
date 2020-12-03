import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import PropTypes from 'prop-types';

import { useRecipes } from './recipes';
import { useAuth } from './auth';

import { fetchMealsSearch } from '../services/foodApi';
import { fetchDrinksSearch } from '../services/drinksApi';

const getID = {
  meals: 'idMeal',
  cocktails: 'idDrink',
};

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
};

const fetchSearchOptions = {
  meals: fetchMealsSearch,
  cocktails: fetchDrinksSearch,
};

const searchContext = createContext();

function SearchProvider({ children }) {
  const [infoSearched, setInfoSearched] = useState(initialSearchValues);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const { updateRecipes } = useRecipes();
  const { userToken } = useAuth();

  const appSearch = useCallback(async (type, { option, value, token }) => {
    setLoadingRecipes(true);

    const userSearch = { option, value, token };

    setInfoSearched((oldInfo) => ({
      ...oldInfo,
      [type]: userSearch,
    }));

    try {
      const fetchRecipes = fetchSearchOptions[type];
      const recipesSearched = await fetchRecipes(userSearch);

      if (!recipesSearched) {
        // eslint-disable-next-line
        alert("Sorry, we couldn't find any recipe with your search.");

        return null;
      }

      let firstItemID;
      const singleRecipeReturned = (recipesSearched.length === 1);

      if (singleRecipeReturned) {
        const firstItem = recipesSearched[0];
        const correctIDAccess = getID[type];
        firstItemID = firstItem[correctIDAccess];
      }

      updateRecipes(type, recipesSearched);

      setLoadingRecipes(false);

      return firstItemID;
    } catch (err) {
      console.log(err);

      // eslint-disable-next-line
      alert('An error happened when searching. Please try again.');
    } finally {
      setLoadingRecipes(false);
    }
  }, [updateRecipes]);

  const updateSearch = useCallback((type, { option, value }) => {
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
}

function useSearch() {
  const context = useContext(searchContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { SearchProvider, useSearch };

SearchProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
};
