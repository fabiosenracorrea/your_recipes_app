import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useExplore } from '../../hooks/explore';
import { useRecipes } from '../../hooks/recipes';
import { useSearch } from '../../hooks/search';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import LoadingBook from '../../components/LoadingBook';
import LoadingSpinner from '../../components/LoadingSpinner';

import './styles.css';

const noFilterOption = {
  option: 'name',
  value: '',
  token: '1',
};

function ExploreArea({ pageType }) {
  const [areaSelected, setAreaSelected] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState(1);

  const {
    loadAreas, loadingAreas, foodAreas, loadingFoodsByArea, loadFoodsByArea,
  } = useExplore();

  const { currentRecipes } = useRecipes();

  const { appSearch, loadingRecipes } = useSearch();

  useEffect(() => {
    loadAreas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loadingAreas) {
      if (areaSelected === 'All') {
        appSearch(pageType, noFilterOption);
      } else {
        loadFoodsByArea(areaSelected);
      }
    }
  }, [areaSelected, loadingAreas, pageType, loadFoodsByArea, appSearch]);

  const handleAreaChange = useCallback(({ target }) => {
    const { value: area } = target;

    setAreaSelected(area);
    setCurrentPage(1);
    setPaging(1);
  }, []);

  const currentRecipesByArea = useMemo(() => {
    const foodsByArea = currentRecipes[pageType];

    return foodsByArea;
  }, [currentRecipes, pageType]);

  const numberOfPages = useMemo(() => {
    const totalRecipes = currentRecipesByArea.length;
    const recipesPerPage = 12;

    const pages = Math.ceil(totalRecipes / recipesPerPage);

    return pages;
  }, [currentRecipesByArea]);

  const pageGenerator = useMemo(() => {
    const maxNumberOfPagesShown = 6;

    const generator = (
      Array
        .from(
          { length: numberOfPages },
          (_, index) => index + 1,
        )
        .filter((page) => {
          const lastPageToShow = paging + maxNumberOfPagesShown;

          let pageInDesiredRange;
          let pageIsWithinLimit;

          if (lastPageToShow <= numberOfPages) {
            pageInDesiredRange = (page >= paging);
            pageIsWithinLimit = page < (paging + maxNumberOfPagesShown);

            return (pageInDesiredRange && pageIsWithinLimit);
          }

          pageInDesiredRange = (page <= numberOfPages);
          pageIsWithinLimit = page > (numberOfPages - maxNumberOfPagesShown);

          return (pageInDesiredRange && pageIsWithinLimit);
        })
    );

    return generator;
  }, [numberOfPages, paging]);

  const shownRecipesPerPage = useMemo(() => {
    const recipesToShow = currentRecipesByArea.filter((_, index) => {
      const ingredientsPerPage = 12;

      const MIN_INDEX = currentPage * ingredientsPerPage - ingredientsPerPage;
      const MAX_INDEX = currentPage * ingredientsPerPage;

      const recipesInRange = (index >= MIN_INDEX && index < MAX_INDEX);

      return recipesInRange;
    });

    return recipesToShow;
  }, [currentPage, currentRecipesByArea]);

  const handlePageChange = useCallback(({ target }) => {
    const selectedPage = Number(target.value);

    if (selectedPage <= numberOfPages) {
      setCurrentPage(selectedPage);
      setPaging(selectedPage);
    }
  }, [numberOfPages]);

  const handlePageDown = useCallback(() => {
    const MINIMUM_PAGING = 1;

    const possibleNewPaging = paging - 1;

    if (possibleNewPaging >= MINIMUM_PAGING) {
      setPaging(possibleNewPaging);
    }
  }, [paging]);

  const handlePageUp = useCallback(() => {
    const MAX_PAGING = numberOfPages;

    const possibleNewPaging = paging + 1;

    if (possibleNewPaging <= MAX_PAGING) {
      setPaging(possibleNewPaging);
    }
  }, [numberOfPages, paging]);

  if (loadingAreas) {
    return (
      <LoadingBook />
    );
  }

  return (
    <div className="explore-ingredients-area-page">
      <Header pageType={ pageType } pageTitle="Explore Origin" showSearch />
      <Navbar />

      <div className="area-select-container">
        <h3>Choose a category:</h3>

        <select
          name="area"
          id="area"
          value={ areaSelected }
          onChange={ handleAreaChange }
          data-testid="explore-by-area-dropdown"
        >
          <option value="All" data-testid="All-option">All</option>

          {foodAreas.map((area) => (
            <option
              key={ area }
              value={ area }
              data-testid={ `${area}-option` }
            >
              {area}

            </option>
          ))}
        </select>
      </div>

      {(loadingFoodsByArea || loadingRecipes)
        ? (
          <LoadingSpinner />
        ) : (

          <div className="recipe-page-card-container">
            <div className="recipes-container">
              {shownRecipesPerPage.map((meal, index) => (
                <Link
                  to={ `/${pageType}/${meal.idMeal}` }
                  className="recipe-card"
                  data-testid={ `${index}-recipe-card` }
                  key={ meal.idMeal }
                >
                  <img
                    src={ meal.strMealThumb }
                    alt={ meal.strMeal }
                    data-testid={ `${index}-card-img` }
                  />
                  <strong data-testid={ `${index}-card-name` }>{meal.strMeal}</strong>
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
                disabled={ paging === numberOfPages }
              >
                <FiChevronRight />
              </button>
            </div>

          </div>
        )}

    </div>
  );
}

ExploreArea.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default ExploreArea;
