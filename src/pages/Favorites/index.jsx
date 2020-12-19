import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import NoRecipeToShow from '../../components/NoRecipeToShow';
import FoodDrinkFilter from '../../components/FoodDrinkFilter';

import { useRecipes } from '../../hooks/recipes';
import useFilterByType from '../../hooks/filterByType';

import { shareWhenMultipleRecipesPresent } from '../../utils/shareRecipe';

import shareIcon from '../../images/shareIcon.svg';
import heartIcon from '../../images/blackHeartIcon.svg';

import './styles.css';

function Favorites() {
  const { favoriteRecipes, updateFavoriteRecipes } = useRecipes();

  const [copyLink, setCopyLink] = useState({});

  const {
    filter,
    filteredItems,
    selectedFilterIsCocktails,
    handleFilterChange,
  } = useFilterByType(favoriteRecipes);

  const handleRecipeUnfavorite = useCallback((id) => {
    const dataToUnfavorite = { id };

    updateFavoriteRecipes(dataToUnfavorite, true);
  }, [updateFavoriteRecipes]);

  return (
    <div className="favorite-recipes-page">
      <Header pageTitle="Favorite Recipes" />

      <FoodDrinkFilter
        handleFilterChange={ handleFilterChange }
        currentFilter={ filter }
      />

      {!filteredItems.length
        ? (
          <NoRecipeToShow isCocktail={ selectedFilterIsCocktails } isFavorites />
        ) : (
          <div className="favorite-recipes-container">
            {filteredItems.map((recipe, index) => (
              <div
                className="favorite-recipe-card"
                key={ `${recipe.type}-${recipe.name}` }
              >
                <Link to={ `/${recipe.type}/${recipe.id}` }>
                  <img
                    src={ recipe.image }
                    alt={ recipe.name }
                    data-testid={ `${index}-horizontal-image` }
                  />
                </Link>

                <Link
                  to={ `/${recipe.type}/${recipe.id}` }
                  data-testid={ `${index}-horizontal-name` }
                >
                  {recipe.name}
                </Link>

                <p data-testid={ `${index}-horizontal-top-text` }>
                  {recipe.type === 'meals'
                    ? `${recipe.area} - ${recipe.category}`
                    : `${recipe.alcoholicOrNot}`}
                </p>

                <div className="favorite-btn-container">

                  <div className="done-recipe-share-container">
                    <button
                      type="button"
                      onClick={ () => shareWhenMultipleRecipesPresent(
                        recipe.id, recipe.type, setCopyLink,
                      ) }
                    >
                      <img
                        src={ shareIcon }
                        alt="share this recipe"
                        data-testid={ `${index}-horizontal-share-btn` }
                      />

                      {copyLink[recipe.id] && (
                        <p>Copied Link!</p>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={ () => handleRecipeUnfavorite(recipe.id, recipe.type) }
                  >
                    <img
                      data-testid={ `${index}-horizontal-favorite-btn` }
                      src={ heartIcon }
                      alt="unfavorite this recipe"
                    />
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}

    </div>
  );
}

export default Favorites;
