import React from 'react';
import { Link } from 'react-router-dom';

import { tRecipeTypes } from '../../@types/appTypes';
import { iGlobalRecipe } from '../../@types/apiTypes';

import './styles.css';

interface iRecipeCardsProps {
  type: tRecipeTypes;
  recipes: Array<iGlobalRecipe>;
}

const RecipeCards: React.FC<iRecipeCardsProps> = ({ type, recipes }) => {
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
};

export default RecipeCards;
