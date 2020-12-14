import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useExplore } from '../../hooks/explore';
import { useSearch } from '../../hooks/search';
import usePaging from '../../hooks/paging';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import LoadingBook from '../../components/LoadingBook';

import getIngredientUrl from './utils/ingredientImageUrl';

import './styles.css';

function ExploreIngredients({ pageType }) {
  const { loadIngredients, ingredientsSearched, loadingIngredients } = useExplore();
  const { updateSearch } = useSearch();

  const {
    paging,
    currentPage,
    numberOfPages,
    shownRecipesByPage: shownIngredientsByPage,
    pageGenerator,
    lastShownPage,
    handlePageDown,
    handlePageUp,
    handlePageChange,
  } = usePaging(ingredientsSearched);

  useEffect(() => {
    loadIngredients(pageType);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIngredientClick = useCallback((value) => {
    const option = 'ingredients';

    const search = { option, value };

    updateSearch(pageType, search);
  }, [pageType, updateSearch]);

  if (loadingIngredients) {
    return (
      <LoadingBook />
    );
  }

  return (
    <div className="explore-ingredients-page">
      <Header pageTitle="Explore Ingredients" />
      <Navbar />

      <h1>Find delicious recipes with these ingredients!</h1>

      <div className="ingredients-container">
        {shownIngredientsByPage.map((ingredient, index) => (
          <Link
            to={ `/${pageType}` }
            onClick={ () => handleIngredientClick(ingredient) }
            data-testid={ `${index}-ingredient-card` }
            className="ingredient-card"
            key={ ingredient }
          >
            <img
              data-testid={ `${index}-card-img` }
              src={ getIngredientUrl(pageType, ingredient) }
              alt={ ingredient }
            />
            <strong data-testid={ `${index}-card-name` }>{ingredient}</strong>
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
  );
}

ExploreIngredients.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default ExploreIngredients;
