import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { render, fireEvent, waitForElement, act, wait, RenderResult } from '@testing-library/react';

import { iFavoriteRecipe } from '../../@types/appTypes';

import RecipeDetails from '../../pages/RecipeDetails';
import AppProvider from '../../hooks';
import { shareWhenSingleRecipePresent } from '../../utils/shareRecipe';

import LocalStorageFake from '../../fakes/localStorage';
import mockedFetch from '../../fakes/mocks_copy/fetch';
import oneMeal, { mealIngredientsAndMeasure } from '../../fakes/mocks_copy/oneMeal';
import drinks from '../../fakes/mocks_copy/drinks';

let screen: RenderResult;
let localStorageFake: LocalStorageFake;
let history: History;
let fakeFetch: jest.SpyInstance;

const mealRendered = oneMeal.meals[0];
const recommendationDrinks = drinks.drinks;

jest.mock('../../utils/shareRecipe.ts', () => ({
  shareWhenSingleRecipePresent: jest.fn((_, __, callback) => callback(true)),
}));

describe('food details page structure testing', () => {
  beforeEach(async () => {
    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
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
});

describe('food details logic testing', () => {
  beforeEach(async () => {
    localStorageFake = new LocalStorageFake();

    localStorageFake.setItem('favoriteRecipes', []);
    localStorageFake.setItem('inProgressRecipes', {});
    localStorageFake.setItem('doneRecipes', []);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));
  });

  it('should list all required food info on screen', () => {
    expect(fakeFetch).toHaveBeenCalled();

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
        `${index}-ingredient-name-and-measure`,
      );

      expect(ingredientAndMeasure).toHaveTextContent(ingredient);
    });

    const expectedYoutubeURL = 'https://www.youtube.com/embed/1IszT_guI08';

    const recipeVideo = screen.getByTestId('video');
    expect(recipeVideo).toBeInTheDocument();
    expect(recipeVideo).toHaveAttribute('src', expectedYoutubeURL);

    const recipeInstructions = screen.getByTestId('instructions');
    expect(recipeInstructions).toBeInTheDocument();
  });

  it('should list 6 drinks recommendations', () => {
    recommendationDrinks.forEach((drink, index) => {
      const drinkCard = screen.queryByTestId(`${index}-recomendation-card`);
      const drinkImg = screen.queryByTestId(`${index}-recomendation-image`);
      const drinkName = screen.queryByTestId(`${index}-recomendation-title`);

      const cutOffIndex = 6;

      if (index < cutOffIndex) {
        expect(drinkCard).toBeInTheDocument();

        expect(drinkImg).toBeInTheDocument();
        expect(drinkImg).toHaveAttribute('src', drink.strDrinkThumb);

        expect(drinkName).toBeInTheDocument();
        expect(drinkName).toHaveTextContent(drink.strDrink);
      } else {
        expect(drinkCard).not.toBeInTheDocument();
        expect(drinkImg).not.toBeInTheDocument();
        expect(drinkName).not.toBeInTheDocument();
      }
    });
  });

  it('should have a start button if recipe has not been started to cook yet', () => {
    const startRecipeBtn = screen.queryByTestId('start-recipe-btn');
    expect(startRecipeBtn).toBeInTheDocument();

    const expectedText = 'Start Recipe';
    expect(startRecipeBtn).toHaveTextContent(expectedText);
  });

  it('should toggle recipe favorite status as clicked on favorite button', () => {
    const favoriteBtn = screen.getByTestId('favorite-btn');

    const repetitiveTries = Array.from(
      { length: 6 },
      (_, index) => index + 1,
    );

    const currentRecipeIsFavorited = (localStorageFake.store.favoriteRecipes as iFavoriteRecipe[]).find(
      (recipe) => recipe.id === mealRendered.idMeal,
    );

    expect(currentRecipeIsFavorited).toBeFalsy();

    repetitiveTries.forEach((tryNumber) => {
      fireEvent.click(favoriteBtn);
      const EVEN_DIVISOR = 2;
      const ZERO = 0;

      const oddTry = (tryNumber % EVEN_DIVISOR !== ZERO);

      const recipeIsFavorite = (localStorageFake.store.favoriteRecipes as iFavoriteRecipe[]).find(
        (recipe) => recipe.id === mealRendered.idMeal,
      );

      if (oddTry) {
        expect(recipeIsFavorite).toBeTruthy();
        expect(recipeIsFavorite?.name).toBe(mealRendered.strMeal);
      } else {
        expect(recipeIsFavorite).toBeFalsy();
      }
    });
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
});

describe('continue recipe test', () => {
  it('should have a continue button if recipe has been started to cook', async () => {
    localStorageFake = new LocalStorageFake();

    const fakeInProgressRecipes = {
      meals: { [mealRendered.idMeal]: ['0', '1'] },
      cocktails: {},
    };

    localStorageFake.setItem('inProgressRecipes', fakeInProgressRecipes);
    localStorageFake.setItem('doneRecipes', []);
    localStorageFake.setItem('favoriteRecipes', []);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });
    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const continueRecipeBtn = screen.queryByTestId('start-recipe-btn');
    expect(continueRecipeBtn).toBeInTheDocument();

    const expectedText = 'Continue Recipe';
    expect(continueRecipeBtn).toHaveTextContent(expectedText);
  });
});

describe('start/continue hidden test', () => {
  it('start/continue should only appear if recipe has not been finished', async () => {
    localStorageFake = new LocalStorageFake();

    const fakeDoneRecipes = [{
      id: mealRendered.idMeal,
      alcoholicOrNot: '',
      area: mealRendered.strArea,
      category: mealRendered.strCategory,
      doneDate: '2020-11-23T22:32:31.616Z',
      image: mealRendered.strMealThumb,
      name: mealRendered.strMeal,
      tags: [],
      type: 'comida',
    }];

    localStorageFake.setItem('doneRecipes', fakeDoneRecipes);
    localStorageFake.setItem('inProgressRecipes', {});
    localStorageFake.setItem('favoriteRecipes', []);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const startRecipeBtn = screen.queryByTestId('start-recipe-btn');
    expect(startRecipeBtn).not.toBeInTheDocument();
  });
});

describe('food details navigation', () => {
  it('should navigate to in-progress page when clicked on start button', async () => {
    localStorageFake = new LocalStorageFake();

    localStorageFake.setItem('doneRecipes', []);
    localStorageFake.setItem('favoriteRecipes', []);
    localStorageFake.setItem('inProgressRecipes', {});

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const startRecipeBtn = screen.getByTestId('start-recipe-btn');

    fireEvent.click(startRecipeBtn);

    const { pathname } = history.location;
    const expectedPath = `/meals/${mealRendered.idMeal}/in-progress`;

    expect(pathname).toBe(expectedPath);
  });

  it('should navigate to in-progress page when clicked on continue button', async () => {
    localStorageFake = new LocalStorageFake();

    const fakeInProgressRecipes = {
      meals: { [mealRendered.idMeal]: ['0', '1'] },
      cocktails: {},
    };

    localStorageFake.setItem('inProgressRecipes', fakeInProgressRecipes);
    localStorageFake.setItem('doneRecipes', []);
    localStorageFake.setItem('favoriteRecipes', []);

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });
    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);

    fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

    const mealPath = `/meals/${mealRendered.idMeal}`;

    history = createMemoryHistory({
      initialEntries: [mealPath],
    });

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Route
            path="/meals/:id"
            render={ () => <RecipeDetails pageType="meals" /> }
          />
        </AppProvider>
      </Router>,
    );

    await waitForElement(() => screen.getByTestId('recipe-title'));

    const continueRecipeBtn = screen.getByTestId('start-recipe-btn');

    fireEvent.click(continueRecipeBtn);

    const { pathname } = history.location;
    const expectedPath = `/meals/${mealRendered.idMeal}/in-progress`;

    expect(pathname).toBe(expectedPath);
  });
});
