import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import NoRecipeToShow from '../../components/NoRecipeToShow';
import FoodDrinkFilter from '../../components/FoodDrinkFilter';

import { useCook } from '../../hooks/cook';
import useFilterByType from '../../hooks/filterByType';

import { shareWhenMultipleRecipesPresent } from '../../utils/shareRecipe';

import shareIcon from '../../images/shareIcon.svg';

import { iDoneRecipe } from '../../@types/appTypes';

import './styles.css';

interface iCopiedLinkTrack {
  [id: string]: boolean;
}

const tagLimit = 2;

const DoneRecipes: React.FC = () => {
  const { doneRecipes } = useCook();

  const [copyLink, setCopyLink] = useState<iCopiedLinkTrack>({});

  const {
    filter,
    filteredItems,
    selectedFilterIsCocktails,
    handleFilterChange,
  } = useFilterByType(doneRecipes);

  return (
    <div className="done-recipes-page">
      <Header pageTitle="Done Recipes" />

      <FoodDrinkFilter
        currentFilter={ filter }
        handleFilterChange={ handleFilterChange }
      />

      {!filteredItems.length
        ? (
          <NoRecipeToShow isCocktail={ selectedFilterIsCocktails } />
        ) : (
          <div className="done-recipes-container">
            {(filteredItems as iDoneRecipe[]).map((recipe, index) => (
              <div className="done-recipe-card" key={ `${recipe.name}-${recipe.id}` }>
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

                <p
                  data-testid={ `${index}-horizontal-done-date` }
                >
                  Cooked on:
                  {' '}
                  {recipe.doneDate}
                </p>

                <div className="done-recipe-share-container">
                  <span>Share this recipe:</span>

                  <button
                    type="button"
                    onClick={ () => shareWhenMultipleRecipesPresent(
                      recipe.id, recipe.type, setCopyLink,
                    ) }
                  >
                    <img
                      data-testid={ `${index}-horizontal-share-btn` }
                      src={ shareIcon }
                      alt="share this recipe"
                    />

                    {copyLink[recipe.id] && (
                      <p>Copied Link!</p>
                    )}
                  </button>
                </div>

                {recipe.type === 'meals' && (
                  <div className="recipe-tag-container">
                    {recipe.tags.filter((_, i) => i < tagLimit).map((tag) => (
                      <span
                        key={ tag }
                        data-testid={ `${index}-${tag}-horizontal-tag` }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

    </div>
  );
};

export default DoneRecipes;
