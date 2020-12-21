import React, {
  createContext, useCallback, useContext, useState,
} from 'react';

import { useAuth } from './auth';
import { useRecipes } from './recipes';

import { fetchMealIngredients,
  fetchFoodAreas,
  fetchFoodsByArea,
} from '../services/foodApi';
import { fetchDrinkIngredients } from '../services/drinksApi';

import { tRecipeTypes } from '../@types/appTypes';

const fetchIngredientsOptions = {
  meals: fetchMealIngredients,
  cocktails: fetchDrinkIngredients,
};

interface iExploreContextProps {
  ingredientsSearched: string[];
  foodAreas: string[];

  loadingIngredients: boolean;
  loadingAreas: boolean;
  loadingFoodsByArea: boolean;

  loadIngredients(type: tRecipeTypes): Promise<void>;
  loadAreas(): void;
  loadFoodsByArea(area: string): void;
}

const exploreContext = createContext<iExploreContextProps>({} as iExploreContextProps);

const ExploreProvider: React.FC = ({ children }) => {
  const [ingredientsSearched, setIngredientsSearched] = useState<string[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  const [foodAreas, setFoodAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingFoodsByArea, setLoadingFoodsByArea] = useState(false);

  const { userToken } = useAuth();
  const { updateRecipes } = useRecipes();

  const loadIngredients = useCallback(async (type: tRecipeTypes) => {
    setLoadingIngredients(true);

    const fetchIngredients = fetchIngredientsOptions[type];

    try {
      const ingredients = await fetchIngredients(userToken);

      const normalizedIngredients = ingredients.map((ingredient) => {
        const iRegex = /strIngredient/i;

        const [ingredientKey] = (
          Object
            .keys(ingredient)
            .filter((key) => iRegex.test(key))
        );

        const ingredientName = ingredient[ingredientKey];

        return ingredientName;
      });

      setIngredientsSearched(normalizedIngredients);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingIngredients(false);
    }
  }, [userToken]);

  const loadAreas = useCallback(async () => {
    setLoadingAreas(true);

    try {
      const apiAreas = await fetchFoodAreas(userToken);

      const areaNames = apiAreas.map((area) => area.strArea);

      setFoodAreas(areaNames);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAreas(false);
    }
  }, [userToken]);

  const loadFoodsByArea = useCallback(async (area: string) => {
    setLoadingFoodsByArea(true);

    try {
      const recipesByArea = await fetchFoodsByArea(area, userToken);
      const areaType = 'meals';

      updateRecipes(areaType, recipesByArea);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingFoodsByArea(false);
    }
  }, [userToken, updateRecipes]);

  return (
    <exploreContext.Provider
      value={ {
        ingredientsSearched,
        foodAreas,

        loadingIngredients,
        loadingAreas,
        loadingFoodsByArea,

        loadIngredients,
        loadAreas,
        loadFoodsByArea,
      } }
    >
      {children}
    </exploreContext.Provider>
  );
}

function useExplore(): iExploreContextProps {
  const context = useContext(exploreContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { ExploreProvider, useExplore };
