import { useState, useMemo, useCallback, ChangeEvent } from 'react';

import { iFavoriteRecipe, iDoneRecipe } from '../@types/appTypes';

type tToFilterRecipes = iFavoriteRecipe | iDoneRecipe;

interface iFilterByType {
  filter: string;
  filteredItems: tToFilterRecipes[];
  selectedFilterIsCocktails: boolean;
  handleFilterChange(inputChangeEvent: ChangeEvent<HTMLInputElement>): void;
}

function useFilterByType(recipes: tToFilterRecipes[]): iFilterByType {
  const [filter, setFilter] = useState('All');

  const filteredItems = useMemo(() => {
    switch (filter) {
    case 'meals':
      return recipes.filter((recipe) => recipe.type === 'meals');
    case 'cocktails':
      return recipes.filter((recipe) => recipe.type === 'cocktails');
    default:
      return recipes;
    }
  }, [recipes, filter]);

  const handleFilterChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value: filterClicked } = target;

    setFilter(filterClicked);
  }, []);

  const selectedFilterIsCocktails = useMemo(() => filter === 'cocktails', [filter]);

  return {
    filter,
    filteredItems,
    selectedFilterIsCocktails,
    handleFilterChange,
  };
}

export default useFilterByType;
