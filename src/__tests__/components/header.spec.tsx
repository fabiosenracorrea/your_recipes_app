import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { render, fireEvent, act, wait, RenderResult } from '@testing-library/react';

import Header from '../../components/Header';
import AppProvider from '../../hooks';

import mockedFetch from '../../fakes/mocks_copy/fetch';
import oneMeal from '../../fakes/mocks_copy/oneMeal';

let screen: RenderResult;
let history: History;

const pageType = 'meals';
const mealID = oneMeal.meals[0].idMeal;

const fakeFetch = jest.spyOn(global, 'fetch').mockImplementation(mockedFetch);

describe('Header component testing', () => {
  it('should have a profile page link', async () => {
    history = createMemoryHistory();

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Header pageTitle={ pageType } pageType={ pageType } />
        </AppProvider>
      </Router>,
    );

    const profileBtn = await screen.findByTestId('profile-top-btn');
    fireEvent.click(profileBtn);

    const { pathname: profilePath } = history.location;
    const expectedPath = '/profile';
    expect(profilePath).toBe(expectedPath);
  });

  it('should have search button if option passed', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const searchBtn = await screen.findByTestId('search-top-btn');

    expect(searchBtn).toBeInTheDocument();
  });

  it('should NOT have search button if option is not passed', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
          />
        </AppProvider>
      </MemoryRouter>,
    );

    await wait(() => {
      const searchBtn = screen.queryByTestId('search-top-btn');
      expect(searchBtn).not.toBeInTheDocument();
    });
  });

  it('should properly display search bar when clicked', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const idsElementsToBePresent = [
      'search-input',
      'exec-search-btn',
      'ingredient-search-radio',
      'name-search-radio',
      'first-letter-search-radio',
    ];

    idsElementsToBePresent.forEach((elementID) => {
      expect(screen.getByTestId(elementID)).toBeInTheDocument();
    });
  });

  it('should properly search for recipes by ingredients', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const textInput = screen.getByTestId('search-input');
    const ingredientRadio = screen.getByTestId('ingredient-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');

    fireEvent.change(textInput, { target: { value: 'Chicken' } });
    fireEvent.click(ingredientRadio);
    fireEvent.click(searchBtn);

    const expectedURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=Chicken';

    await wait(() => {
      expect(fakeFetch).toHaveBeenCalledWith(expectedURL);
    });
  });

  it('should properly search for recipes by name', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const textInput = screen.getByTestId('search-input');
    const nameRadioElement = screen.getByTestId('name-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');

    fireEvent.change(textInput, { target: { value: 'soup' } });
    fireEvent.click(nameRadioElement);
    fireEvent.click(searchBtn);

    const expectedURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=soup';

    await wait(() => {
      expect(fakeFetch).toHaveBeenCalledWith(expectedURL);
    });
  });

  it('should properly search for recipes by first-letter', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const textInput = screen.getByTestId('search-input');
    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');

    fireEvent.change(textInput, { target: { value: 'a' } });
    fireEvent.click(firstLetterRadio);
    fireEvent.click(searchBtn);

    const expectedURL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a';

    await wait(() => {
      expect(fakeFetch).toHaveBeenCalledWith(expectedURL);
    });
  });

  // eslint-disable-next-line
  it('should alert and not search for recipes when more than one letter is written', async () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </MemoryRouter>,
    );

    const alertFunc = jest.spyOn(global, 'alert').mockImplementation(() => console.log('alert was called!'));

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const textInput = screen.getByTestId('search-input');
    const firstLetterRadio = screen.getByTestId('first-letter-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');

    fireEvent.change(textInput, { target: { value: 'ab' } });
    fireEvent.click(firstLetterRadio);
    fireEvent.click(searchBtn);

    const expectedURL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=ab';

    await wait(() => {
      expect(alertFunc).toHaveBeenCalled();
      expect(fakeFetch).not.toHaveBeenCalledWith(expectedURL);
    });
  });

  it('should redirect to details page if search has single recipe', async () => {
    history = createMemoryHistory();

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Header
            pageTitle={ pageType }
            pageType={ pageType }
            showSearch
          />
        </AppProvider>
      </Router>,
    );

    const searchBarButton = await screen.findByTestId('search-top-btn');

    act(() => {
      fireEvent.click(searchBarButton);
    });

    const textInput = screen.getByTestId('search-input');
    const nameRadio = screen.getByTestId('name-search-radio');
    const searchBtn = screen.getByTestId('exec-search-btn');

    fireEvent.change(textInput, { target: { value: 'Arrabiata' } });
    fireEvent.click(nameRadio);
    fireEvent.click(searchBtn);

    const expectedURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata';

    await wait(() => {
      expect(fakeFetch).toHaveBeenCalledWith(expectedURL);
    });

    const { pathname: recipePath } = history.location;
    const expectedPath = `${pageType}/${mealID}`;
    expect(recipePath).toBe(expectedPath);
  });
});
