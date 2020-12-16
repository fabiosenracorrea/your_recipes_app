import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { FiMenu } from 'react-icons/fi';

import Input from '../../components/Input';

const inputName = 'e-mail';

let screen;

describe('AppModal component testing', () => {
  it('should render an Input correctly', () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => {} }
      />,
    );

    const input = screen.getByTestId('input-elm');

    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('should add proper style when focused and remove it once blur happens', async () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => {} }
      />,
    );

    const input = screen.getByTestId('input-elm');

    await wait(() => {
      fireEvent.focus(input);
    });

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-focus';

    expect(container).toHaveClass(expectedClass);

    await wait(() => {
      fireEvent.blur(input);
    });

    const containerCheck = screen.getByTestId('input-container');

    expect(containerCheck).not.toHaveClass(expectedClass);
  });

  it('should add proper style when input has text', async () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        value="some-text"
        onChange={ () => {} }
      />,
    );

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-text';

    expect(container).toHaveClass(expectedClass);
  });

  it('should add proper style when error is present', async () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => {} }
        error
      />,
    );

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-error';

    expect(container).toHaveClass(expectedClass);
  });
});
