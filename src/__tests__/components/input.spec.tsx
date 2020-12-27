import React from 'react';
import { render, fireEvent, act, RenderResult } from '@testing-library/react';
import { FiMenu } from 'react-icons/fi';

import Input from '../../components/Input';

const inputName = 'e-mail';

let screen: RenderResult;

describe('AppModal component testing', () => {
  it('should render an Input correctly', () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => console.log('change function called!') }
      />,
    );

    const input = screen.getByTestId('input-elm');

    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('should add proper style when focused and remove it once blur happens', () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => console.log('change function called!') }
      />,
    );

    const input = screen.getByTestId('input-elm');

    act(() => {
      fireEvent.focus(input);
    });

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-focus';

    expect(container).toHaveClass(expectedClass);

    act(() => {
      fireEvent.blur(input);
    });

    const containerCheck = screen.getByTestId('input-container');

    expect(containerCheck).not.toHaveClass(expectedClass);
  });

  it('should add proper style when input has text', () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        value="some-text"
        onChange={ () => console.log('change function called!') }
      />,
    );

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-text';

    expect(container).toHaveClass(expectedClass);
  });

  it('should add proper style when error is present', () => {
    screen = render(
      <Input
        name={ inputName }
        icon={ FiMenu }
        onChange={ () => console.log('change function called!') }
        error
      />,
    );

    const container = screen.getByTestId('input-container');
    const expectedClass = 'has-error';

    expect(container).toHaveClass(expectedClass);
  });
});
