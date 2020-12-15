import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useExplore } from '../../hooks/explore';
import { useRecipes } from '../../hooks/recipes';
import { useSearch } from '../../hooks/search';
import usePaging from '../../hooks/paging';

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

  const {
    loadAreas, loadingAreas, foodAreas, loadingFoodsByArea, loadFoodsByArea,
  } = useExplore();

  const { currentRecipes } = useRecipes();

  const { appSearch, loadingRecipes } = useSearch();

  useEffect(() => {
    loadAreas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // this effect makes sure we load recipes by area accordingly
  // as the user changes the selected area.
  useEffect(() => {
    if (!loadingAreas) {
      if (areaSelected === 'All') {
        appSearch(pageType, noFilterOption);
      } else {
        loadFoodsByArea(areaSelected);
      }
    }
  }, [areaSelected, loadingAreas, pageType, loadFoodsByArea, appSearch]);

  const currentRecipesByArea = useMemo(() => {
    const foodsByArea = currentRecipes[pageType];

    return foodsByArea;
  }, [currentRecipes, pageType]);

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
  } = usePaging(currentRecipesByArea);

  const handleAreaChange = useCallback(({ target }) => {
    const { value: area } = target;

    setAreaSelected(area);
    resetPaging();
  }, [resetPaging]);

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
              {shownRecipesByPage.map((meal, index) => (
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

ExploreArea.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default ExploreArea;
