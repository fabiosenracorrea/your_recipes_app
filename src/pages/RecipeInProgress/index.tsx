import React, {
  useMemo, useState, useCallback, useEffect,
} from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

import { useCook } from '../../hooks/cook';
import { useRecipes } from '../../hooks/recipes';

import LoadingBook from '../../components/LoadingBook';

import parseRecipeToFavorite from '../../utils/parseFavoriteRecipeFormat';
import parseIngredientAndMeasures from '../../utils/parseIngredientAndMeasures';
import { shareWhenSingleRecipePresent } from '../../utils/shareRecipe';

import shareIcon from '../../images/shareIcon.svg';
import blackHeart from '../../images/blackHeartIcon.svg';
import whiteHeart from '../../images/whiteHeartIcon.svg';

import { iBasicPageProps } from '../../@types/appTypes';
import { iGlobalRecipe } from '../../@types/apiTypes';

import './styles.css';

interface iRouteParamsProps {
  id: string;
}

const RecipeInProgress: React.FC<iBasicPageProps> = ({ pageType }) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    sessionStartedRecipes,
    recipesProgress,
    updateRecipeProgress,
    finalizeRecipe,
    loadRecipeToCook,
  } = useCook();

  const { id } = useParams<iRouteParamsProps>();

  const { push } = useHistory();

  const { favoriteRecipes, updateFavoriteRecipes } = useRecipes();

  useEffect(() => {
    const recipeToCook = sessionStartedRecipes[pageType].find(({ recipe }) => (
      recipe.idMeal === id || recipe.idDrink
    ));

    if (!recipeToCook) {
      loadRecipeToCook(pageType, id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentlyCooking = useMemo(() => {
    const recipeToCook = sessionStartedRecipes[pageType].find(({ recipe }) => (
      recipe.idMeal === id || recipe.idDrink === id
    ));

    if (!recipeToCook) {
      return {} as iGlobalRecipe;
    }

    return recipeToCook.recipe;
  }, [id, sessionStartedRecipes, pageType]);

  const recipeIsFavorited = useMemo(() => {
    const recipeInFavorites = favoriteRecipes.find((recipe) => recipe.id === id);

    return !!recipeInFavorites;
  }, [id, favoriteRecipes]);

  const handleFavoriteToggle = useCallback(() => {
    const favoriteRecipe = parseRecipeToFavorite(pageType, currentlyCooking);

    updateFavoriteRecipes(favoriteRecipe, recipeIsFavorited);
  }, [pageType, currentlyCooking, updateFavoriteRecipes, recipeIsFavorited]);

  const recipeIngredients = useMemo(() => {
    const ingredients = parseIngredientAndMeasures(currentlyCooking);

    return ingredients;
  }, [currentlyCooking]);

  const handleIngredientClick = useCallback(({ target }) => {
    const itemIndex = target.value;

    updateRecipeProgress(pageType, id, itemIndex);
  }, [updateRecipeProgress, id, pageType]);

  const currentProgress = useMemo(() => {
    const progressArray = recipesProgress[pageType][id];

    if (!progressArray) {
      return [];
    }

    const newProgressArray = [...progressArray];

    return newProgressArray;
  }, [recipesProgress, id, pageType]);

  const oneLastIngredient = useMemo(() => {
    const lengthOfMissingOneIngredient = recipeIngredients.length - 1;

    const missingOneIngredient = (
      lengthOfMissingOneIngredient === currentProgress.length
    );

    return missingOneIngredient;
  }, [currentProgress, recipeIngredients]);

  const canFinalizeRecipe = useMemo(() => {
    const everyIngredientChecked = recipeIngredients.every(
      (_, index) => currentProgress.includes(`${index}`),
    );

    return everyIngredientChecked;
  }, [recipeIngredients, currentProgress]);

  const handleFinalizeRecipe = useCallback(() => {
    finalizeRecipe(pageType, id);

    push('/done-recipes');
  }, [id, finalizeRecipe, pageType, push]);

  if (!currentlyCooking.strInstructions) {
    return (
      <LoadingBook />
    );
  }

  return (
    <div className="recipe-progress-page">
      <header className="details-header">
        <Link to={ `/${pageType}` }>
          <FiArrowLeft />
        </Link>
      </header>

      <div className="recipe-name-container">
        <h2 data-testid="recipe-title">
          {currentlyCooking.strMeal || currentlyCooking.strDrink }
        </h2>

        <img
          data-testid="recipe-photo"
          src={ currentlyCooking.strMealThumb || currentlyCooking.strDrinkThumb }
          alt={ currentlyCooking.strMeal || currentlyCooking.strDrink }
        />
      </div>

      <div className="recipe-details-container">
        <p data-testid="recipe-category">
          {currentlyCooking.strAlcoholic || currentlyCooking.strCategory}
        </p>

        {(pageType === 'meals') && (
          <p>{currentlyCooking.strArea}</p>
        )}

        <div className="recipe-btn-container">
          <button type="button" onClick={ handleFavoriteToggle }>
            <img
              data-testid="favorite-btn"
              src={ recipeIsFavorited ? blackHeart : whiteHeart }
              alt="favorite this recipe"
            />
          </button>

          <button
            onClick={ () => shareWhenSingleRecipePresent(id, pageType, setCopiedLink) }
            type="button"
          >
            <img
              data-testid="share-btn"
              src={ shareIcon }
              alt="share this recipe"
            />
          </button>

          {copiedLink && (
            <span data-testid="share-return">Copied Link!</span>
          )}
        </div>

        <div className="recipe-ingredients in-progress-ingredients">
          <h2>Ingredients: Follow along!</h2>

          {recipeIngredients.map((ingredient, index) => (
            <div
              className="ingredients-checkbox-container"
              key={ ingredient }
            >
              <input
                type="checkbox"
                name={ ingredient }
                id={ ingredient }
                value={ index }
                checked={ currentProgress.includes(`${index}`) }
                onChange={ handleIngredientClick }
              />

              <label
                key={ ingredient }
                data-testid={ `${index}-ingredient-step` }
                htmlFor={ ingredient }
                className={ currentProgress.includes(`${index}`) ? 'item-checked' : '' }
              >
                {ingredient}
              </label>
            </div>
          ))}

          {!!currentProgress.length && (
            <div className="progress-bar-section">
              <h3>
                {oneLastIngredient
                  ? 'One more to go!'
                  : `${canFinalizeRecipe ? 'Nice job!!' : 'Current Progress'}`}
              </h3>

              <div className="progress-bar-container">
                {recipeIngredients.map((ingredient, index) => (
                  <div
                    key={ `${ingredient}-${index}` }
                    className={ `
                    ${(currentProgress[index]) ? 'p-done' : 'p-miss'}
                    ${currentProgress.length === recipeIngredients.length ? 'i-done' : ''}
                  ` }
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div data-testid="instructions" className="recipe-instructions">
          <h2>Instructions</h2>

          <p>
            {currentlyCooking.strInstructions}
          </p>
        </div>
      </div>

      <button
        type="button"
        data-testid="finish-recipe-btn"
        className="finish-recipe-btn"
        disabled={ !canFinalizeRecipe }
        onClick={ handleFinalizeRecipe }
      >
        <FiCheck />
        Complete Recipe
      </button>

    </div>
  );
};

export default RecipeInProgress;
