import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { useExplore } from '../../hooks/explore';
import { useSearch } from '../../hooks/search';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import LoadingBook from '../../components/LoadingBook';

import getIngredientUrl from './utils/ingredientImageUrl';

import './styles.css';

function ExploreIngredients({ pageType }) {
  const { loadIngredients, ingredientsSearched, loadingIngredients } = useExplore();
  const { updateSearch } = useSearch();

  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState(1);

  useEffect(() => {
    loadIngredients(pageType);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIngredientClick = useCallback((value) => {
    const option = 'ingredients';

    const search = { option, value };

    updateSearch(pageType, search);
  }, [pageType, updateSearch]);

  const numberOfPages = useMemo(() => {
    const totalIngredients = ingredientsSearched.length;
    const ingredientsPerPage = 12;

    const pages = Math.ceil(totalIngredients / ingredientsPerPage);

    return pages;
  }, [ingredientsSearched]);

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

  const shownIngredientsByPage = useMemo(() => {
    const ingredientsToShow = ingredientsSearched.filter((_, index) => {
      const ingredientsPerPage = 12;

      const MIN_INDEX = currentPage * ingredientsPerPage - ingredientsPerPage;
      const MAX_INDEX = currentPage * ingredientsPerPage;

      const ingredientInPageRange = (index >= MIN_INDEX && index < MAX_INDEX);

      return ingredientInPageRange;
    });

    return ingredientsToShow;
  }, [currentPage, ingredientsSearched]);

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
        <button type="button" onClick={ handlePageDown }>
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

        <button type="button" onClick={ handlePageUp }>
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
