import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent, waitForElement, act, wait } from '@testing-library/react';

import RecipeInProgress from '../../pages/RecipeInProgress';
import AppProvider from '../../hooks';
import App from '../../App';
import { shareWhenSingleRecipePresent } from '../../utils/shareRecipe';

import LocalStorageFake from '../../fakes/localStorage';
import mockedFetch from '../../fakes/mocks_copy/fetch';
import oneMeal, { mealIngredientsAndMeasure } from '../../fakes/mocks_copy/oneMeal';
import inProgressRecipes from '../../fakes/recipes/inProgress';

jest.mock('../../utils/shareRecipe.js', () => ({
  shareWhenSingleRecipePresent: jest.fn((_, __, callback) => callback(true)),
}));

let screen;
let localStorageFake;
let history;
let fakeFetch;
const mealRendered = oneMeal.meals[0];

describe('food details page structure testing', () => {
  beforeEach(async () => {
    localStorageFake = new LocalStorageFake();

    localStorageFake.setItem('inProgressRecipes', inProgressRecipes);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}/in-progress`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id/in-progress"
            render={ () => <RecipeInProgress pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));
  });

  it('should not have the header', () => {
    expect(screen.queryByTestId('profile-top-btn')).not.toBeInTheDocument();

    const pageTitle = screen.queryByTestId('page-title');
    expect(pageTitle).not.toBeInTheDocument();

    expect(screen.queryByTestId('search-top-btn')).not.toBeInTheDocument();
  });

  it('should NOT have the navBar', () => {
    expect(screen.queryByTestId('drinks-bottom-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('food-bottom-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('explore-bottom-btn')).not.toBeInTheDocument();
  });

  it('should fetch recipe info on load, displaying all the correct information', () => {
    expect(fakeFetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771');

    const recipeImg = screen.getByTestId('recipe-photo');
    expect(recipeImg).toBeInTheDocument();
    expect(recipeImg).toHaveAttribute('src', mealRendered.strMealThumb);

    const recipeName = screen.getByTestId('recipe-title');
    expect(recipeName).toBeInTheDocument();
    expect(recipeName).toHaveTextContent(mealRendered.strMeal);

    expect(screen.getByTestId('share-btn')).toBeInTheDocument();

    expect(screen.getByTestId('favorite-btn')).toBeInTheDocument();

    mealIngredientsAndMeasure.forEach((ingredient, index) => {
      const ingredientAndMeasure = screen.getByTestId(
        `${index}-ingredient-step`,
      );

      expect(ingredientAndMeasure).toHaveTextContent(ingredient);
    });

    const recipeInstructions = screen.getByTestId('instructions');
    expect(recipeInstructions).toBeInTheDocument();

    const finishRecipeBtn = screen.getByTestId('finish-recipe-btn');
    expect(finishRecipeBtn).toBeInTheDocument();
    expect(finishRecipeBtn).toHaveTextContent('Complete Recipe');
  });

  it('should correctly load meal progress from local storage', () => {
    const foodProgress = inProgressRecipes.meals[mealRendered.idMeal];

    mealIngredientsAndMeasure.forEach((ingredient, index) => {
      const ingredientShouldBeChecked = foodProgress.includes(`${index}`);

      const checkInput = screen.getByLabelText(ingredient);

      if (ingredientShouldBeChecked) {
        expect(checkInput).toBeChecked();
      } else {
        expect(checkInput).not.toBeChecked();
      }
    });
  });

  it('should correctly save/unsave from favorites', () => {
    const favoriteBtn = screen.getByTestId('favorite-btn');

    const repetitiveTries = Array.from(
      { length: 6 },
      (_, index) => index + 1,
    );

    const currentRecipeIsFavorited = localStorageFake.store.favoriteRecipes.find(
      (recipe) => recipe.id === mealRendered.idMeal,
    );

    expect(currentRecipeIsFavorited).toBeFalsy();

    repetitiveTries.forEach((tryNumber) => {
      fireEvent.click(favoriteBtn);
      const EVEN_DIVISOR = 2;
      const ZERO = 0;

      const oddTry = (tryNumber % EVEN_DIVISOR !== ZERO);

      const recipeIsFavorite = localStorageFake.store.favoriteRecipes.find(
        (recipe) => recipe.id === mealRendered.idMeal,
      );

      if (oddTry) {
        expect(recipeIsFavorite).toBeTruthy();
        expect(recipeIsFavorite.name).toBe(mealRendered.strMeal);
      } else {
        expect(recipeIsFavorite).toBeFalsy();
      }
    });
  });

  it('should correctly update progress we click though, until button enables', () => {
    const foodProgress = inProgressRecipes.meals[mealRendered.idMeal];

    mealIngredientsAndMeasure.forEach((ingredient, index) => {
      const ingredientShouldBeChecked = foodProgress.includes(`${index}`);

      const checkInput = screen.getByLabelText(ingredient);

      let finalizeBtn = screen.getByTestId('finish-recipe-btn');
      expect(finalizeBtn).toBeDisabled();

      if (!ingredientShouldBeChecked) {
        fireEvent.click(checkInput);

        const newProgress = (
          localStorageFake
            .store
            .inProgressRecipes
            .meals[mealRendered.idMeal]
        );

        const ingredientIsNowChecked = newProgress.includes(`${index}`);

        expect(ingredientIsNowChecked).toBeTruthy();
      }

      const lastIndex = mealIngredientsAndMeasure.length - 1;

      if (index === lastIndex) {
        finalizeBtn = screen.getByTestId('finish-recipe-btn');
        expect(finalizeBtn).toBeEnabled();

        fireEvent.click(checkInput);
        finalizeBtn = screen.getByTestId('finish-recipe-btn');
        expect(finalizeBtn).not.toBeEnabled();
      }
    });
  });

  it('should correctly remove progress of one ingredient', () => {
    const indexToRemove = '2';

    const checkInput = screen.getByLabelText(mealIngredientsAndMeasure[indexToRemove]);
    expect(checkInput).toBeChecked();

    fireEvent.click(checkInput);

    expect(checkInput).not.toBeChecked();

    const newProgress = (
      localStorageFake
        .store
        .inProgressRecipes
        .meals[mealRendered.idMeal]
    );

    const ingredientStillPresent = newProgress.includes(indexToRemove);

    expect(ingredientStillPresent).toBeFalsy();
  });

  it('should copy link to clipboard when share link clicked', async () => {
    const shareBtn = screen.getByTestId('share-btn');

    act(() => {
      fireEvent.click(shareBtn);
    });

    await wait(() => {
      expect(screen.getByTestId('share-return')).toBeInTheDocument();
    });

    expect(shareWhenSingleRecipePresent).toHaveBeenCalled();
  });

  it('should correctly save recipe and navigate if we finalize it', () => {
    const foodProgress = inProgressRecipes.meals[mealRendered.idMeal];

    mealIngredientsAndMeasure.forEach((ingredient, index) => {
      const ingredientShouldBeChecked = foodProgress.includes(`${index}`);

      const checkInput = screen.getByLabelText(ingredient);

      if (!ingredientShouldBeChecked) {
        fireEvent.click(checkInput);
      }
    });

    const priorFavorites = localStorageFake.store.doneRecipes || [];

    const recipeWasInDoneBefore = priorFavorites.find(
      (recipe) => recipe.id === mealRendered.idMeal,
    );

    expect(recipeWasInDoneBefore).toBeFalsy();

    const finalizeBtn = screen.getByTestId('finish-recipe-btn');

    const fakeNow = 1606254408524;
    jest.spyOn(Date, 'now').mockImplementation(() => fakeNow);

    fireEvent.click(finalizeBtn);

    const updatedFavorites = localStorageFake.store.doneRecipes;

    const recipeSuccessfullySaved = updatedFavorites.find(
      (recipe) => recipe.id === mealRendered.idMeal,
    );

    expect(recipeSuccessfullySaved).toBeTruthy();

    const expectedDate = '6:46 PM - 11/24/2020';

    const expectedTags = mealRendered.strTags.split(',');

    const expectedRecipeFormat = {
      alcoholicOrNot: '',
      area: mealRendered.strArea,
      category: mealRendered.strCategory,
      doneDate: expectedDate,
      id: mealRendered.idMeal,
      image: mealRendered.strMealThumb,
      name: mealRendered.strMeal,
      tags: expectedTags,
      type: 'meals',
    };

    expect(recipeSuccessfullySaved).toStrictEqual(expectedRecipeFormat);

    const { pathname } = history.location;
    const expectedPath = '/done-recipes';
    expect(pathname).toBe(expectedPath);
  });
});

describe('food details exception tests', () => {
  it('should load an empty array as progress if previously not present', async () => {
    localStorageFake = new LocalStorageFake();

    const fakeProgress = {
      meals: {},
      cocktails: {},
    };

    localStorageFake.setItem('inProgressRecipes', fakeProgress);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}/in-progress`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id/in-progress"
            render={ () => <RecipeInProgress pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const firstIngredient = screen.getByTestId('0-ingredient-step');

    act(() => {
      fireEvent.click(firstIngredient);
    });

    const progressArray = localStorageFake.store.inProgressRecipes.meals[mealRendered.idMeal];

    const progressExpected = ['0'];

    expect(progressArray).toStrictEqual(progressExpected);
  });
});

describe('app navigation to test session recipe info saving', () => {
  it('save recipe details if loaded from meals details page', async () => {
    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    localStorageFake = new LocalStorageFake();

    const fakeProgress = {
      meals: {},
      cocktails: {},
    };

    localStorageFake.setItem('inProgressRecipes', fakeProgress);
    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    screen = render(
      <App />,
    );

    const validEmail = 'fabio@email.com';
    const validPw = 'fabio123456';

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.change(passwordInput, { target: { value: validPw } });

    const loginBtn = screen.getByTestId('login-submit-btn');

    fireEvent.click(loginBtn);

    await waitForElement(() => screen.getByTestId('0-recipe-card'));

    fireEvent.click(screen.getByTestId('0-recipe-card'));

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const fetchCallsBeforeComponentLoad = fakeFetch.mock.calls.length;

    fireEvent.click(screen.getByTestId('start-recipe-btn'));

    await waitForElement(() => screen.getByTestId('recipe-photo'));

    const fetchCallsAfterComponentLoad = fakeFetch.mock.calls.length;

    expect(fetchCallsAfterComponentLoad).toBe(fetchCallsBeforeComponentLoad);
  });
});
