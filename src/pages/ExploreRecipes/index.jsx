import React, { useMemo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaGlobeAmericas } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom, GiJigsawPiece } from 'react-icons/gi';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

import { useSingleRecipe } from '../../hooks/singleRecipe';

import './styles.css';

function ExploreRecipes({ pageType }) {
  const isFoodPage = useMemo(() => (pageType === 'meals'), [pageType]);

  const { loadRandomRecipe } = useSingleRecipe();
  const { push } = useHistory();

  const handleRandomClick = useCallback(async () => {
    const randomRecipeID = await loadRandomRecipe(pageType);

    if (!randomRecipeID) {
      // eslint-disable-next-line
      alert('An error has ocurried on your random search. Please try again.');

      return;
    }

    const randomRecipeUrl = `/${pageType}/${randomRecipeID}`;

    push(randomRecipeUrl);
  }, [pageType, loadRandomRecipe, push]);

  return (
    <div className="explore-recipes-page">
      <Header pageType={ pageType } pageTitle={ `Explore ${pageType}` } />
      <Navbar />

      <h1>How would you like to explore?</h1>

      <div className={ `explore-recipes-content ${!isFoodPage ? 'explore-drinks' : ''}` }>
        <Link
          to={ `/explore/${pageType}/ingredients` }
          data-testid="explore-by-ingredient"
        >
          <GiJigsawPiece />
          By
          <br />
          Ingredients

        </Link>

        {isFoodPage && (
          <Link
            to={ `/explore/${pageType}/area` }
            data-testid="explore-by-area"
          >
            <FaGlobeAmericas />
            By
            <br />
            Place of Origin

          </Link>
        )}

        <button
          type="button"
          data-testid="explore-surprise"
          onClick={ handleRandomClick }
        >
          <GiPerspectiveDiceSixFacesRandom />
          Surprise
          <br />

          Me!

        </button>
      </div>

    </div>
  );
}

ExploreRecipes.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default ExploreRecipes;
