import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import { render, fireEvent, RenderResult } from '@testing-library/react';

import Navbar from '../../components/Navbar';

let screen: RenderResult;
let testPath: string;
let history: History;

describe('NavBar component testing', () => {
  beforeEach(() => {
    testPath = '/test';

    history = createMemoryHistory({
      initialEntries: [testPath],
    });

    screen = render(
      <Router history={ history }>
        <Navbar />
      </Router>,
    );
  });

  it('should have the correct elements', () => {
    expect(screen.getByTestId('drinks-bottom-btn')).toBeInTheDocument();
    expect(screen.getByTestId('food-bottom-btn')).toBeInTheDocument();
    expect(screen.getByTestId('explore-bottom-btn')).toBeInTheDocument();
  });

  it('should navigate to the correct page on each nav link', () => {
    // drinks page

    const drinksPageLink = screen.getByTestId('drinks-bottom-btn');
    fireEvent.click(drinksPageLink);

    const { pathname: drinksPath } = history.location;
    const expectedDrinksPath = '/cocktails';
    expect(drinksPath).toBe(expectedDrinksPath);
    history.push(testPath);

    // foods page

    const foodsPageLink = screen.getByTestId('food-bottom-btn');
    fireEvent.click(foodsPageLink);

    const { pathname: foodPath } = history.location;
    const expectedFoodPath = '/meals';
    expect(foodPath).toBe(expectedFoodPath);
    history.push(testPath);

    // explore page

    const explorePageLink = screen.getByTestId('explore-bottom-btn');
    fireEvent.click(explorePageLink);

    const { pathname: explorePath } = history.location;
    const expectedExplorePath = '/explore';
    expect(explorePath).toBe(expectedExplorePath);
  });
});
