import { useState, useMemo, useCallback } from 'react';

function useFilterByType(doneRecipes) {
  const [filter, setFilter] = useState('All');

  const filteredItems = useMemo(() => {
    switch (filter) {
    case 'meals':
      return doneRecipes.filter((recipe) => recipe.type === 'meals');
    case 'cocktails':
      return doneRecipes.filter((recipe) => recipe.type === 'cocktails');
    default:
      return doneRecipes;
    }
  }, [doneRecipes, filter]);

  const handleFilterChange = useCallback(({ target }) => {
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
