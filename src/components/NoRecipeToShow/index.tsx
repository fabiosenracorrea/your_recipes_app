import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

interface iNoRecipesProps {
  isCocktail: boolean;
  isFavorites?: boolean;
}

const NoRecipeToShow: React.FC<iNoRecipesProps> = ({ isCocktail, isFavorites = false }) => {
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
};

export default NoRecipeToShow;
