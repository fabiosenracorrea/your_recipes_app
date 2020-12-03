import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  fetchDrinkDetails, fetchRandomDrink, fetchDrinkRecommendations,
} from '../services/drinksApi';
import {
  fetchMealDetails, fetchRandomMeal, fetchFoodRecommendations,
} from '../services/foodApi';

import { useAuth } from './auth';

const singleRecipeStructure = {
  meals: {
    recipe: {},
    recommendations: [],
  },
  cocktails: {
    recipe: {},
    recommendations: [],
  },
};

export const fetchSinglesOptions = {
  meals: fetchMealDetails,
  cocktails: fetchDrinkDetails,
};

const fetchRecommendationsOptions = {
  meals: fetchDrinkRecommendations,
  cocktails: fetchFoodRecommendations,
};

const fetchRandomOptions = {
  meals: fetchRandomMeal,
  cocktails: fetchRandomDrink,
};

const singleRecipeContext = createContext();

function SingleRecipeProvider({ children }) {
  const [currentFocusedRecipes, setCurrentFocusedRecipes] = useState(
    singleRecipeStructure,
  );

  const [loadingSingleRecipe, setLoadingSingleRecipe] = useState(true);
  const [randomRedirect, setRandomRedirect] = useState(false);

  const { userToken } = useAuth();

  const loadSingleRecipe = useCallback(async (type, recipeID) => {
    if (randomRedirect) return;

    setLoadingSingleRecipe(true);

    const loadRecipe = fetchSinglesOptions[type];
    const loadRecommendations = fetchRecommendationsOptions[type];

    try {
      const recipe = await loadRecipe(recipeID, userToken);

      let recommendations = await loadRecommendations(userToken);

      const REC_LIMIT = 6;
      recommendations = recommendations.filter((_, index) => index < REC_LIMIT);

      const newSingleRecipe = {
        recipe,
        recommendations,
      };

      setCurrentFocusedRecipes((oldFocused) => ({
        ...oldFocused,
        [type]: newSingleRecipe,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSingleRecipe(false);
    }
  }, [userToken, randomRedirect]);

  const loadRandomRecipe = useCallback(async (type) => {
    setLoadingSingleRecipe(true);

    const loadRandom = fetchRandomOptions[type];
    const loadRecommendations = fetchRecommendationsOptions[type];

    let randomID;
    let recipe;

    try {
      [randomID, recipe] = await loadRandom(userToken);

      let recommendations = await loadRecommendations(userToken);

      const REC_LIMIT = 6;
      recommendations = recommendations.filter((_, index) => index < REC_LIMIT);

      setRandomRedirect(true);

      const newSingleRecipe = {
        recipe,
        recommendations,
      };

      setCurrentFocusedRecipes((oldFocused) => ({
        ...oldFocused,
        [type]: newSingleRecipe,
      }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSingleRecipe(false);
    }

    return randomID;
  }, [userToken]);

  const unloadRandom = useCallback(() => {
    setRandomRedirect(false);
  }, []);

  return (
    <singleRecipeContext.Provider
      value={ {
        currentFocusedRecipes,
        loadingSingleRecipe,
        loadSingleRecipe,
        loadRandomRecipe,
        unloadRandom,
      } }
    >
      {children}
    </singleRecipeContext.Provider>
  );
}

function useSingleRecipe() {
  const context = useContext(singleRecipeContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { SingleRecipeProvider, useSingleRecipe };

SingleRecipeProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
};
