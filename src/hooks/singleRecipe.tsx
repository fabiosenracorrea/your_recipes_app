import React, {
  createContext, useCallback, useContext, useState,
} from 'react';

import {
  fetchDrinkDetails, fetchRandomDrink, fetchDrinkRecommendations,
} from '../services/drinksApi';
import {
  fetchMealDetails, fetchRandomMeal, fetchFoodRecommendations,
} from '../services/foodApi';

import { useAuth } from './auth';

import { tRecipeTypes } from '../@types/appTypes';
import { iGlobalRecipe } from '../@types/apiTypes';

const singleRecipeStructure = {
  meals: {
    recipe: {} as iGlobalRecipe,
    recommendations: [],
  },
  cocktails: {
    recipe: {} as iGlobalRecipe,
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

interface iSingleRecipe {
  recipe: iGlobalRecipe;
  recommendations: iGlobalRecipe[];
}

interface iSingleRecipesByType {
  meals: iSingleRecipe;
  cocktails: iSingleRecipe;
}

interface iSingleRecipeContextProps {
  currentFocusedRecipes: iSingleRecipesByType;
  loadingSingleRecipe: boolean;
  loadSingleRecipe(type: tRecipeTypes, recipeID: string): void;
  loadRandomRecipe(type: tRecipeTypes): void;
  unloadRandom(): void;
}

const singleRecipeContext = createContext<iSingleRecipeContextProps>({} as iSingleRecipeContextProps);

const SingleRecipeProvider: React.FC = ({ children }) => {
  const [currentFocusedRecipes, setCurrentFocusedRecipes] = useState<iSingleRecipesByType>(
    singleRecipeStructure,
  );

  const [loadingSingleRecipe, setLoadingSingleRecipe] = useState(true);
  const [randomRedirect, setRandomRedirect] = useState(false);

  const { userToken } = useAuth();

  const loadSingleRecipe = useCallback(async (type: tRecipeTypes, recipeID: string) => {
    if (randomRedirect) return;

    setLoadingSingleRecipe(true);

    const loadRecipe = fetchSinglesOptions[type];
    const loadRecommendations = fetchRecommendationsOptions[type];

    try {
      const recipe = await loadRecipe(recipeID, userToken);

      const recommendations = await loadRecommendations(userToken);

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

  const loadRandomRecipe = useCallback(async (type: tRecipeTypes) => {
    setLoadingSingleRecipe(true);

    const loadRandom = fetchRandomOptions[type];
    const loadRecommendations = fetchRecommendationsOptions[type];

    let randomID;
    let recipe;

    try {
      [randomID, recipe] = await loadRandom(userToken);

      const recommendations = await loadRecommendations(userToken);

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
};

function useSingleRecipe(): iSingleRecipeContextProps {
  const context = useContext(singleRecipeContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { SingleRecipeProvider, useSingleRecipe };
