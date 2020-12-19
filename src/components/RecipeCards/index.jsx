import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './styles.css';

function RecipeCards({ type, recipes }) {
  return (
    <div className="recipes-container">
      {recipes.map((recipe, index) => (
        <Link
          to={ `/${type}/${recipe.idMeal || recipe.idDrink}` }
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
  );
}

RecipeCards.propTypes = {
  type: PropTypes.string.isRequired,
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      idMeal: PropTypes.string,
      idDrink: PropTypes.string,
      strMealThumb: PropTypes.string,
      strDrinkThumb: PropTypes.string,
      strMeal: PropTypes.string,
      strDrink: PropTypes.string,
    }),
  ).isRequired,
};

export default RecipeCards;
