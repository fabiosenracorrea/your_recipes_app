import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import AppModal from '../../components/AppModal';

const modalTitle = 'This is a title!';
const modalDescription = 'This is a description! :)';

let screen;
let testModalRef;

describe('AppModal component testing', () => {
  beforeEach(() => {
    testModalRef = {
      current: null,
    };

    screen = render(
      <AppModal
        title={ modalTitle }
        description={ modalDescription }
        ref={ testModalRef }
      />,
    );
  });

  it('should render nothing when first rendered', () => {
    expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-description')).not.toBeInTheDocument();
  });

  it('should correctly forward ref and show title/description when opened', () => {
    act(() => {
      testModalRef.current.openModal();
    });

    const titleElement = screen.getByTestId('modal-title');
    const descriptionElement = screen.getByTestId('modal-description');
    const closeElement = screen.getByTestId('modal-close');

    expect(titleElement).toHaveTextContent(modalTitle);
    expect(descriptionElement).toHaveTextContent(modalDescription);
    expect(closeElement).toBeInTheDocument();
  });

  it('should display nothing after closed', () => {
    act(() => {
      testModalRef.current.openModal();
    });

    const closeElement = screen.getByTestId('modal-close');

    act(() => {
      fireEvent.click(closeElement);
    });

    expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-description')).not.toBeInTheDocument();
  });
});
