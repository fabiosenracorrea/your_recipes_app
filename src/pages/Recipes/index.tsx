import React, { useEffect, useMemo, useState } from 'react';

import { useSearch } from '../../hooks/search';
import { useRecipes } from '../../hooks/recipes';
import usePaging from '../../hooks/paging';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Paging from '../../components/Paging';
import RecipeFilters from '../../components/RecipeFilters';
import RecipeCards from '../../components/RecipeCards';
import LoadingBook from '../../components/LoadingBook';
import LoadingSpinner from '../../components/LoadingSpinner';

import { tRecipeTypes } from '../../@types/appTypes';

import './styles.css';

interface iRecipesPageProps {
  pageType: tRecipeTypes;
}

const Recipes: React.FC<iRecipesPageProps> = ({ pageType }) => {
  const [filterSelected, setFilterSelected] = useState('All');

  const [filterPage, setFilterPage] = useState(1);

  const { infoSearched, appSearch, loadingRecipes } = useSearch();

  const {
    currentRecipes,
    currentFilteredRecipes,
    loadingFilters,
    loadingByCategory,
  } = useRecipes();

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

  useEffect(() => {
    const recipesToSearch = infoSearched[pageType];

    appSearch(pageType, recipesToSearch);

    setFilterSelected('All');
    setFilterPage(1);
    resetPaging();
  }, [pageType]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingFilters) {
    return (
      <LoadingBook />
    );
  }

  return (
    <div className="recipes-page">
      <Header pageType={ pageType } pageTitle={ pageType } showSearch />
      <Navbar />

      <RecipeFilters
        pageType={ pageType }
        resetPaging={ resetPaging }
        filterPage={ filterPage }
        setFilterPage={ setFilterPage }
        filterSelected={ filterSelected }
        setFilterSelected={ setFilterSelected }
      />

      {(loadingRecipes || loadingByCategory)
        ? (
          <LoadingSpinner />
        ) : (
          <div className="recipe-page-card-container">
            <RecipeCards recipes={ shownRecipesByPage } type={ pageType } />

            <Paging
              handlePageChange={ handlePageChange }
              handlePageDown={ handlePageDown }
              handlePageUp={ handlePageUp }
              generator={ pageGenerator }
              currentPage={ currentPage }
              paging={ paging }
              lastShownPage={ lastShownPage }
              numberOfPages={ numberOfPages }
            />
          </div>
        )}

    </div>
  );
};

export default Recipes;
