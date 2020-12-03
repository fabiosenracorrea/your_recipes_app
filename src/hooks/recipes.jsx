import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

import { fetchDrinksCategories, fetchDrinksByCategory } from '../services/drinksApi';
import { fetchFoodsCategories, fetchMealsByCategory } from '../services/foodApi';
import { useAuth } from './auth';

const recipesStructure = {
  meals: [],
  cocktails: [],
};

const fetchCategoryOptions = {
  meals: fetchMealsByCategory,
  cocktails: fetchDrinksByCategory,
};

const recipesContext = createContext();

function RecipeProvider({ children }) {
  const [currentRecipes, setCurrentRecipes] = useState(recipesStructure);

  const [currentFilteredRecipes, setCurrentFilteredRecipes] = useState(recipesStructure);

  const [currentFilters, setCurrentFilters] = useState(recipesStructure);

  const [loadingFilters, setLoadingFilters] = useState(true);

  const [loadingByCategory, setLoadingByCategory] = useState(false);

  const [favoriteRecipes, setFavoriteRecipes] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];

    return favorites;
  });

  const { userToken } = useAuth();

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  useEffect(() => {
    async function getCategories() {
      setLoadingFilters(true);
      const foodCategories = await fetchFoodsCategories(userToken);
      const drinkCategories = await fetchDrinksCategories(userToken);

      const categories = {
        meals: foodCategories,
        cocktails: drinkCategories,
      };

      setCurrentFilters(categories);

      const API_DELAY = 1000;
      setTimeout(() => setLoadingFilters(false), API_DELAY);
    }

    getCategories();
  }, [userToken]);

  const updateRecipes = useCallback((type, newRecipes) => {
    setCurrentRecipes((oldRecipes) => ({
      ...oldRecipes,
      [type]: newRecipes,
    }));
  }, []);

  const updateFilteredRecipes = useCallback(async (type, category) => {
    setLoadingByCategory(true);

    const fetchCategories = fetchCategoryOptions[type];

    const recipesByCategory = await fetchCategories(category, userToken);

    setCurrentFilteredRecipes((oldRecipes) => ({
      ...oldRecipes,
      [type]: recipesByCategory,
    }));

    setLoadingByCategory(false);
  }, [userToken]);

  const updateFavoriteRecipes = useCallback(({
    id, type, area, category, alcoholicOrNot, name, image,
  }, isFavorite) => {
    if (isFavorite) { // we should un-favorite and end function
      setFavoriteRecipes((oldFavorites) => {
        const newFavorites = oldFavorites.filter((recipe) => recipe.id !== id);

        return newFavorites;
      });

      return;
    }

    const newFavorite = {
      id,
      type,
      area,
      category,
      alcoholicOrNot,
      name,
      image,
    };

    setFavoriteRecipes((oldFavorites) => [...oldFavorites, newFavorite]);
  }, []);

  return (
    <recipesContext.Provider
      value={ {
        currentRecipes,
        currentFilters,
        favoriteRecipes,
        currentFilteredRecipes,
        loadingFilters,
        loadingByCategory,
        updateRecipes,
        updateFilteredRecipes,
        updateFavoriteRecipes,
      } }
    >
      {children}
    </recipesContext.Provider>
  );
}

function useRecipes() {
  const context = useContext(recipesContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { RecipeProvider, useRecipes };

RecipeProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
};
