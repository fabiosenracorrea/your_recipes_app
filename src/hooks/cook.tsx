import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';

import { useAuth } from './auth';
import { fetchSinglesOptions } from './singleRecipe';

import saveDoneRecipe from './utils/saveDoneRecipes';
import removeInProgressRecipe from './utils/removeInProgressRecipe';

import { tRecipeTypes, iDoneRecipe } from '../@types/appTypes';
import { iGlobalRecipe } from '../@types/apiTypes';

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

interface iSessionRecipe {
  recipe: iGlobalRecipe;
  finished: boolean;
}

interface iSessionStartedRecipes {
  meals: Array<iSessionRecipe>;
  cocktails: Array<iSessionRecipe>;
}

interface iRecipesProgress {
  cocktails: {
    [id: string]: string[];
  };

  meals: {
    [id: string]: string[];
  };
}

interface iCookContextProps {
  sessionStartedRecipes: iSessionStartedRecipes;
  recipesProgress: iRecipesProgress;
  doneRecipes: iDoneRecipe[];
  startCooking(type: tRecipeTypes, recipe: iGlobalRecipe): void;
  updateRecipeProgress(type: tRecipeTypes, recipeID: string, item: string): void;
  finalizeRecipe(type: tRecipeTypes, recipeID: string): void;
  loadRecipeToCook(type: tRecipeTypes, recipeID: string): void;
}

const cookContext = createContext<iCookContextProps>({} as iCookContextProps);

const CookProvider: React.FC = ({ children }) => {
  const [sessionStartedRecipes, setSessionStartedRecipes] = useState<iSessionStartedRecipes>(
    sessionRecipesStructure,
  );

  const [recipesProgress, setRecipesProgress] = useState<iRecipesProgress>(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes') || '');

    if (inProgressRecipes) {
      return inProgressRecipes;
    }

    return localStorageTrack;
  });

  const [doneRecipes, setDoneRecipes] = useState<iDoneRecipe[]>(() => {
    const recipesDone = JSON.parse(localStorage.getItem('doneRecipes') || '');

    if (recipesDone) {
      return recipesDone;
    }

    return [];
  });

  const { userToken } = useAuth();

  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(recipesProgress));
  }, [recipesProgress]);

  const startCooking = useCallback((type: tRecipeTypes, recipe: iGlobalRecipe) => {
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

  const updateRecipeProgress = useCallback((type: tRecipeTypes, recipeID: string, item: string) => {
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

  const finalizeRecipe = useCallback((type: tRecipeTypes, recipeID: string) => {
    setSessionStartedRecipes((oldCooks) => {
      const oldRecipesStarted = oldCooks[type];

      const updatedRecipes = oldRecipesStarted.map(({ recipe, finished }) => {
        const recipeAccess = recipeIdOptions[type] as keyof iGlobalRecipe;
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

  const loadRecipeToCook = useCallback(async (type: tRecipeTypes, recipeID: string) => {
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
};

function useCook(): iCookContextProps {
  const context = useContext(cookContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { CookProvider, useCook };
