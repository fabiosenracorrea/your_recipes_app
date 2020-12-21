import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render } from '@testing-library/react';

import NotFound from '../../pages/NotFound';

let screen;
let history;

describe('not found testings', () => {
  beforeEach(() => {
    history = createMemoryHistory();

    screen = render(
      <Router history={ history }>
        <NotFound />
      </Router>,
    );
  });

  it('should have the correct test', () => {
    const notFoundContent = /not found/i;

    const pageTitle = screen.getByText(notFoundContent);
    expect(pageTitle).toBeInTheDocument();
  });

  it('should have a home button', () => {
    const homeButton = screen.getByTestId('home-button');

    expect(homeButton).toBeInTheDocument();

    fireEvent.click(homeButton);

    const { pathname } = history.location;
    const expectedPath = '/meals';
    expect(pathname).toBe(expectedPath);
  });
});
