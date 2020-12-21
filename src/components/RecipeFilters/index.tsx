import React, { useCallback, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useSearch, initialSearchValues } from '../../hooks/search';
import { useRecipes } from '../../hooks/recipes';

import { tRecipeTypes } from '../../@types/appTypes';

import './styles.css';

interface iRecipeFilterProps {
  pageType: tRecipeTypes;
  filterPage: number;
  filterSelected: string;
  resetPaging(): void;
  setFilterPage(page: number): void;
  setFilterSelected(filter: string): void;
}

const RecipeFilters: React.FC<iRecipeFilterProps> = ({
  pageType,
  resetPaging,
  filterPage,
  setFilterPage,
  filterSelected,
  setFilterSelected,
}) => {
  const { currentFilters, updateFilteredRecipes } = useRecipes();
  const { appSearch } = useSearch();

  const handleFilterChange = useCallback(({ target }) => {
    const { value: category } = target;

    const noFilterCategory = 'All';

    if (category === filterSelected || category === noFilterCategory) {
      const recipesToSearch = initialSearchValues[pageType];

      appSearch(pageType, recipesToSearch);

      setFilterSelected(noFilterCategory);
      resetPaging();
      setFilterPage(1);
      return;
    }

    updateFilteredRecipes(pageType, category);
    setFilterSelected(category);
    resetPaging();
  }, [updateFilteredRecipes, pageType, appSearch, filterSelected, resetPaging, setFilterSelected]);

  const currentRecipeFilters = useMemo(() => {
    const apiFilters = currentFilters[pageType];

    const desiredFilters = ['All', ...apiFilters];

    return desiredFilters;
  }, [currentFilters, pageType]);

  const filterPages = useMemo(() => {
    const totalFilters = currentRecipeFilters.length;
    const filtersPerPage = 6;

    const pages = Math.ceil(totalFilters / filtersPerPage);

    return pages;
  }, [currentRecipeFilters]);

  const handleFilterDown = useCallback(() => {
    const MINIMUM_PAGING = 1;

    const possibleNewPaging = filterPage - 1;

    if (possibleNewPaging >= MINIMUM_PAGING) {
      setFilterPage(possibleNewPaging);
    }
  }, [filterPage, setFilterPage]);

  const handleFilterUp = useCallback(() => {
    const MAX_PAGING = filterPages;

    const possibleNewPaging = filterPage + 1;

    if (possibleNewPaging <= MAX_PAGING) {
      setFilterPage(possibleNewPaging);
    }
  }, [filterPages, filterPage, setFilterPage]);

  const filtersShown = useMemo(() => {
    const filtersToShow = currentRecipeFilters.filter((_, index) => {
      const filtersPerPage = 6;

      const MIN_INDEX = filterPage * filtersPerPage - filtersPerPage;
      const MAX_INDEX = filterPage * filtersPerPage;

      const filtersInPage = (index >= MIN_INDEX && index < MAX_INDEX);

      return filtersInPage;
    });

    return filtersToShow;
  }, [filterPage, currentRecipeFilters]);

  return (
    <section className="recipe-filters">
      <button
        type="button"
        onClick={ handleFilterDown }
        disabled={ filterPage === 1 }
      >
        <FiChevronLeft />
      </button>

      <div className="filters-container">

        {filtersShown.map((filter) => (
          <div className="label-container" key={ filter }>
            <input
              type="checkbox"
              name="filter"
              id={ filter }
              value={ filter }
              checked={ filterSelected === filter }
              onChange={ handleFilterChange }
            />

            <label
              data-testid={ `${filter}-category-filter` }
              htmlFor={ filter }
              key={ filter }
            >
              {filter}
            </label>

          </div>
        ))}

      </div>

      <button
        type="button"
        onClick={ handleFilterUp }
        disabled={ filterPage === filterPages }
      >
        <FiChevronRight />
      </button>

    </section>
  );
};

export default RecipeFilters;
