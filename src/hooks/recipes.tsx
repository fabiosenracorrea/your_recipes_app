import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';

import { fetchDrinksCategories, fetchDrinksByCategory } from '../services/drinksApi';
import { fetchFoodsCategories, fetchMealsByCategory } from '../services/foodApi';
import { useAuth } from './auth';

import { iFavoriteRecipe, tRecipeTypes } from '../@types/appTypes';
import { iGlobalRecipe } from '../@types/apiTypes';

const recipesStructure = {
  meals: [],
  cocktails: [],
};

const fetchCategoryOptions = {
  meals: fetchMealsByCategory,
  cocktails: fetchDrinksByCategory,
};

interface iFiltersByType {
  meals: string[];
  cocktails: string[];
}

interface iRecipesByType {
  meals: iGlobalRecipe[];
  cocktails: iGlobalRecipe[];
}

interface iRecipesContextProps {
  currentRecipes: iRecipesByType;
  currentFilters: iFiltersByType;
  favoriteRecipes: iFavoriteRecipe[];
  currentFilteredRecipes: iRecipesByType;
  loadingFilters: boolean;
  loadingByCategory: boolean;
  updateRecipes(type: tRecipeTypes, newRecipes: iGlobalRecipe[]): void;
  updateFilteredRecipes(type: tRecipeTypes, category: string): Promise<void>;
  updateFavoriteRecipes(recipeInfo: iFavoriteRecipe, isFavorite: boolean): void;
}

const recipesContext = createContext<iRecipesContextProps>({} as iRecipesContextProps);

const RecipeProvider: React.FC = ({ children }) => {
  const [currentRecipes, setCurrentRecipes] = useState<iRecipesByType>(recipesStructure);

  const [currentFilteredRecipes, setCurrentFilteredRecipes] = useState<iRecipesByType>(recipesStructure);

  const [currentFilters, setCurrentFilters] = useState<iFiltersByType>(recipesStructure);

  const [loadingFilters, setLoadingFilters] = useState(true);

  const [loadingByCategory, setLoadingByCategory] = useState(false);

  const [favoriteRecipes, setFavoriteRecipes] = useState<iFavoriteRecipe[]>(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');

    return favorites;
  });

  const { userToken } = useAuth();

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  useEffect(() => {
    async function getCategories(): Promise<void> {
      setLoadingFilters(true);

      try {
        const foodCategories = await fetchFoodsCategories(userToken);
        const drinkCategories = await fetchDrinksCategories(userToken);

        const categories = {
          meals: foodCategories,
          cocktails: drinkCategories,
        };

        setCurrentFilters(categories);
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingFilters(false);
      }
    }

    getCategories();
  }, [userToken]);

  const updateRecipes = useCallback((type: tRecipeTypes, newRecipes: iGlobalRecipe[]) => {
    setCurrentRecipes((oldRecipes) => ({
      ...oldRecipes,
      [type]: newRecipes,
    }));
  }, []);

  const updateFilteredRecipes = useCallback(async (type: tRecipeTypes, category: string) => {
    setLoadingByCategory(true);

    try {
      const fetchCategories = fetchCategoryOptions[type];

      const recipesByCategory = await fetchCategories(category, userToken);

      setCurrentFilteredRecipes((oldRecipes) => ({
        ...oldRecipes,
        [type]: recipesByCategory,
      }));
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingByCategory(false);
    }
  }, [userToken]);

  const updateFavoriteRecipes = useCallback(({
    id, type, area, category, alcoholicOrNot, name, image,
  }: iFavoriteRecipe, isFavorite: boolean) => {
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
};

function useRecipes(): iRecipesContextProps {
  const context = useContext(recipesContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { RecipeProvider, useRecipes };
