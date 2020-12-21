import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';

import Register from '../../pages/Register';
import AppProvider from '../../hooks';

import LocalStorageFake from '../../fakes/localStorage';

let screen;

const validEmail = 'fabio@email.com';
const validPw = 'fabio123456';
const validName = 'Fábio Corrêa';

describe('Register page structure testing', () => {
  beforeEach(() => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Register />
        </AppProvider>
      </MemoryRouter>,
    );
  });

  it('should have a form with name, email, password and submit button', () => {
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit-btn')).toBeInTheDocument();
  });

  // eslint-disable-next-line
  it('should have the login button disabled until valid name/email/password is input', () => {
    expect(screen.getByTestId('register-submit-btn')).toBeDisabled();

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    const invalidEmail = 'fabio@fabio';
    const invalidEmail2 = '@fabio.com';
    const invalidEmail3 = 'fabio.com';
    const invalidEmail4 = 'fabiosenracorrea';
    const invalidEmailOptions = [
      invalidEmail, invalidEmail2, invalidEmail3, invalidEmail4,
    ];

    const invalidPw = '123456';
    const invalidPw2 = 'fabio';
    const invalidPwOptions = [invalidPw, invalidPw2];

    invalidEmailOptions.forEach((invalidE) => {
      invalidPwOptions.forEach((invalidP) => {
        fireEvent.change(emailInput, { target: { value: invalidE } });
        fireEvent.change(passwordInput, { target: { value: invalidP } });

        expect(screen.getByTestId('register-submit-btn')).toBeDisabled();
      });
    });

    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.change(passwordInput, { target: { value: validPw } });

    expect(screen.getByTestId('register-submit-btn')).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: validName } });
    expect(screen.getByTestId('register-submit-btn')).toBeEnabled();
  });

  it('should have a modal button functioning correctly', () => {
    const openModalBtn = screen.getByTestId('register-modal');

    expect(openModalBtn).toBeInTheDocument();

    fireEvent.click(openModalBtn);

    const modalTitle = screen.getByTestId('modal-title');
    const modalDescription = screen.getByTestId('modal-description');

    expect(modalTitle).toBeInTheDocument();
    expect(modalDescription).toBeInTheDocument();

    const closeModalButton = screen.getByTestId('modal-close');
    fireEvent.click(closeModalButton);

    const modalTitleCheck = screen.queryByTestId('modal-title');
    expect(modalTitleCheck).not.toBeInTheDocument();
  });
});

describe('Login page logic testing', () => {
  it('should correctly save user name into local storage', () => {
    screen = render(
      <MemoryRouter>
        <AppProvider>
          <Register />
        </AppProvider>
      </MemoryRouter>,
    );

    const localStorageFake = new LocalStorageFake();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageFake,
      writable: true,
    });

    jest.spyOn(JSON, 'parse').mockImplementation((value) => value);
    jest.spyOn(JSON, 'stringify').mockImplementation((value) => value);
    const localGetItem = jest.spyOn(localStorageFake, 'getItem');
    const localSetItem = jest.spyOn(localStorageFake, 'setItem');

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(nameInput, { target: { value: validName } });
    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.change(passwordInput, { target: { value: validPw } });

    const registerBtn = screen.getByTestId('register-submit-btn');

    fireEvent.click(registerBtn);

    const numberOfLocalStorageInteractions = 1;
    expect(localSetItem).toHaveBeenCalledTimes(numberOfLocalStorageInteractions);
    expect(localGetItem).toHaveBeenCalledTimes(numberOfLocalStorageInteractions);

    const expectedUserNamesKey = 'userNames';

    const expectedLocalStorageValue = { [validEmail]: validName };

    const mockedLocalStorageValues = localStorageFake.store;

    expect(mockedLocalStorageValues[expectedUserNamesKey])
      .toStrictEqual(expectedLocalStorageValue);
  });

  it('should redirect user to the login page after registered', () => {
    const history = createMemoryHistory();

    screen = render(
      <Router history={ history }>
        <AppProvider>
          <Register />
        </AppProvider>
      </Router>,
    );

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(nameInput, { target: { value: validName } });
    fireEvent.change(emailInput, { target: { value: validEmail } });
    fireEvent.change(passwordInput, { target: { value: validPw } });

    const register = screen.getByTestId('register-submit-btn');

    fireEvent.click(register);

    const { pathname } = history.location;
    const expectedPath = '/';

    expect(pathname).toBe(expectedPath);
  });
});
