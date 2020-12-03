import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

import { useAuth } from './auth';
import { fetchSinglesOptions } from './singleRecipe';

import saveDoneRecipe from './utils/saveDoneRecipes';
import removeInProgressRecipe from './utils/removeInProgressRecipe';

const sessionRecipesStructure = {
  meals: [],
  cocktails: [],
};

const localStorageTrack = {
  cocktails: {},
  meals: {},
};

const recipeIdOptions = {
  meals: 'idMeal',
  cocktails: 'idDrink',
};

const cookContext = createContext();

function CookProvider({ children }) {
  const [sessionStartedRecipes, setSessionStartedRecipes] = useState(
    sessionRecipesStructure,
  );

  const [recipesProgress, setRecipesProgress] = useState(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));

    if (inProgressRecipes) {
      return inProgressRecipes;
    }

    return localStorageTrack;
  });

  const [doneRecipes, setDoneRecipes] = useState(() => {
    const recipesDone = JSON.parse(localStorage.getItem('doneRecipes'));

    if (recipesDone) {
      return recipesDone;
    }

    return [];
  });

  const { userToken } = useAuth();

  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(recipesProgress));
  }, [recipesProgress]);

  const startCooking = useCallback((type, recipe) => {
    setSessionStartedRecipes((oldCooks) => {
      const oldRecipesStarted = oldCooks[type];

      const newRecipeStarted = {
        recipe,
        finished: false,
      };

      const newSessionRecipes = [...oldRecipesStarted, newRecipeStarted];

      return {
        ...oldCooks,
        [type]: newSessionRecipes,
      };
    });
  }, []);

  const updateRecipeProgress = useCallback((type, recipeID, item) => {
    setRecipesProgress((oldRecipes) => {
      const recipeProgress = oldRecipes[type][recipeID] || [];
      const toUpdateProgress = [...recipeProgress];

      if (toUpdateProgress.includes(item)) {
        const itemIndex = toUpdateProgress.findIndex((itemAdded) => itemAdded === item);

        toUpdateProgress.splice(itemIndex, 1);
      } else {
        toUpdateProgress.push(item);
      }

      const oldRecipesProgressOnType = oldRecipes[type];

      const updatedRecipesProgressOnType = {
        ...oldRecipesProgressOnType,
        [recipeID]: toUpdateProgress,
      };

      return ({
        ...oldRecipes,
        [type]: updatedRecipesProgressOnType,
      });
    });
  }, []);

  const finalizeRecipe = useCallback((type, recipeID) => {
    setSessionStartedRecipes((oldCooks) => {
      const oldRecipesStarted = oldCooks[type];

      const updatedRecipes = oldRecipesStarted.map(({ recipe, finished }) => {
        const recipeAccess = recipeIdOptions[type];
        const recipeToUpdateID = recipe[recipeAccess];

        if (recipeToUpdateID !== recipeID) {
          return { recipe, finished };
        }

        const recipeUpdated = { recipe, finished: true };

        const newDoneRecipes = saveDoneRecipe(type, recipe);
        removeInProgressRecipe(type, recipeID);
        setDoneRecipes(newDoneRecipes);

        return recipeUpdated;
      });

      return {
        ...oldCooks,
        [type]: [updatedRecipes],
      };
    });
  }, []);

  const loadRecipeToCook = useCallback(async (type, recipeID) => {
    const fetchSingle = fetchSinglesOptions[type];

    try {
      const recipe = await fetchSingle(recipeID, userToken);

      startCooking(type, recipe);
    } catch (err) {
      console.log(err);
    }
  }, [userToken, startCooking]);

  return (
    <cookContext.Provider
      value={ {
        sessionStartedRecipes,
        recipesProgress,
        doneRecipes,
        startCooking,
        updateRecipeProgress,
        finalizeRecipe,
        loadRecipeToCook,
      } }
    >
      {children}
    </cookContext.Provider>
  );
}

function useCook() {
  const context = useContext(cookContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { CookProvider, useCook };

CookProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
};
