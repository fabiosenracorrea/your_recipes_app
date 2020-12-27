import React, {
  useCallback, useEffect, useState, useMemo, ChangeEvent,
} from 'react';

import { useExplore } from '../../hooks/explore';
import { useRecipes } from '../../hooks/recipes';
import { useSearch } from '../../hooks/search';
import usePaging from '../../hooks/paging';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Paging from '../../components/Paging';
import SelectArea from './components/SelectArea';
import RecipeCards from '../../components/RecipeCards';
import LoadingBook from '../../components/LoadingBook';
import LoadingSpinner from '../../components/LoadingSpinner';

import { iBasicPageProps, iSearchOptions } from '../../@types/appTypes';

import './styles.css';
import { iGlobalRecipe } from '../../@types/apiTypes';

const noFilterOption = {
  option: 'name',
  value: '',
  token: '1',
} as iSearchOptions;

const ExploreArea: React.FC<iBasicPageProps> = ({ pageType }) => {
  const [areaSelected, setAreaSelected] = useState('All');

  const {
    loadAreas, loadingAreas, loadingFoodsByArea, loadFoodsByArea,
  } = useExplore();

  const { currentRecipes } = useRecipes();

  const { appSearch, loadingRecipes } = useSearch();

  useEffect(() => {
    loadAreas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // this effect makes sure we load recipes by area accordingly
  // as the user changes the selected area.
  useEffect(() => {
    if (areaSelected === 'All') {
      appSearch(pageType, noFilterOption);
    } else {
      loadFoodsByArea(areaSelected);
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

  const handleAreaChange = useCallback(({ target }: ChangeEvent<HTMLSelectElement>) => {
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

      <SelectArea areaSelected={ areaSelected } handleAreaChange={ handleAreaChange } />

      {(loadingFoodsByArea || loadingRecipes)
        ? (
          <LoadingSpinner />
        ) : (
          <div className="recipe-page-card-container">
            <RecipeCards recipes={ shownRecipesByPage as iGlobalRecipe[] } type={ pageType } />

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

export default ExploreArea;
