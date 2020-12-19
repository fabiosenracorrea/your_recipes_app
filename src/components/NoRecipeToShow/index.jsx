import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './styles.css';

function NoRecipeToShow({ isCocktail, isFavorites = false }) {
  return (
    <div className="zero-recipes-container">
      <h2>
        You don&apos;t have any
        {' '}
        {`${isFavorites ? 'favorite' : 'completed'}`}
        {' '}
        recipe here.
      </h2>

      <Link to={ `${isCocktail ? '/cocktails' : '/meals'}` }>
        Find one to cook now!
      </Link>
    </div>
  );
}

NoRecipeToShow.defaultProps = {
  isFavorites: false,
};

NoRecipeToShow.propTypes = {
  isCocktail: PropTypes.bool.isRequired,
  isFavorites: PropTypes.bool,
};

export default NoRecipeToShow;
