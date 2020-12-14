import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useSearch, initialSearchValues } from '../../hooks/search';
import { useRecipes } from '../../hooks/recipes';
import usePaging from '../../hooks/paging';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import LoadingBook from '../../components/LoadingBook';
import LoadingSpinner from '../../components/LoadingSpinner';

import './styles.css';

function Recipes({ pageType }) {
  const [filterSelected, setFilterSelected] = useState('All');

  const [filterPage, setFilterPage] = useState(1);

  const { infoSearched, appSearch, loadingRecipes } = useSearch();

  const {
    currentRecipes,
    currentFilters,
    currentFilteredRecipes,
    updateFilteredRecipes,
    loadingFilters,
    loadingByCategory,
  } = useRecipes();

  useEffect(() => {
    const recipesToSearch = infoSearched[pageType];

    appSearch(pageType, recipesToSearch);
  }, [pageType]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadedRecipes = useMemo(() => {
    if (filterSelected === 'All') {
      return currentRecipes[pageType];
    }

    return currentFilteredRecipes[pageType];
  }, [currentRecipes, currentFilteredRecipes, filterSelected, pageType]);

  const {
    paging,
    currentPage,
    numberOfPages,
    shownRecipesByPage,
    pageGenerator,
    lastShownPage,
    handlePageDown,
    handlePageUp,
    handlePageChange,
    resetPaging,
  } = usePaging(loadedRecipes);

  const handleFilterChange = useCallback(({ target }) => {
    const { value: category } = target;

    const noFilterCategory = 'All';

    if (category === filterSelected || category === noFilterCategory) {
      const recipesToSearch = initialSearchValues[pageType];

      appSearch(pageType, recipesToSearch);

      setFilterSelected(noFilterCategory);
      resetPaging();
      return;
    }

    updateFilteredRecipes(pageType, category);
    setFilterSelected(category);
    resetPaging();
  }, [updateFilteredRecipes, pageType, appSearch, filterSelected]);

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
  }, [filterPage]);

  const handleFilterUp = useCallback(() => {
    const MAX_PAGING = filterPages;

    const possibleNewPaging = filterPage + 1;

    if (possibleNewPaging <= MAX_PAGING) {
      setFilterPage(possibleNewPaging);
    }
  }, [filterPages, filterPage]);

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

  if (loadingFilters) {
    return (
      <LoadingBook />
    );
  }

  return (
    <div className="recipes-page">
      <Header pageType={ pageType } pageTitle={ pageType } showSearch />
      <Navbar />

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

      {(loadingRecipes || loadingByCategory)
        ? (
          <LoadingSpinner />
        ) : (
          <div className="recipe-page-card-container">
            <div className="recipes-container">
              {shownRecipesByPage.map((recipe, index) => (
                <Link
                  to={ `/${pageType}/${recipe.idMeal || recipe.idDrink}` }
                  className="recipe-card"
                  data-testid={ `${index}-recipe-card` }
                  key={ recipe.idMeal || recipe.idDrink }
                >
                  <img
                    src={ recipe.strMealThumb || recipe.strDrinkThumb }
                    alt={ recipe.strMeal || recipe.strDrink }
                    data-testid={ `${index}-card-img` }
                  />

                  <strong data-testid={ `${index}-card-name` }>
                    {recipe.strMeal || recipe.strDrink }
                  </strong>
                </Link>
              ))}
            </div>

            <div className="paging-container">
              <button
                type="button"
                onClick={ handlePageDown }
                disabled={ paging === 1 }
              >
                <FiChevronLeft />
              </button>

              {pageGenerator.map((page) => (
                <label
                  key={ `${page}-${Math.random()}` }
                  className="single-paging"
                  htmlFor={ `page-${page}` }
                >
                  <input
                    type="radio"
                    name="page"
                    id={ `page-${page}` }
                    value={ page }
                    onChange={ handlePageChange }
                    checked={ currentPage === page }
                  />
                  <span>
                    {page}
                  </span>
                </label>
              ))}

              <button
                type="button"
                onClick={ handlePageUp }
                disabled={ lastShownPage === numberOfPages }
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

    </div>
  );
}

Recipes.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default Recipes;
