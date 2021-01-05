import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

import './styles.css';

interface iModalProps {
  title: string;
  description: string;
}

export interface ModalRef {
  openModal(): void;
}

const AppModal: React.ForwardRefRenderFunction<ModalRef, iModalProps> = ({ title, description }, ref) => {
  const [visible, setVisible] = useState(false);

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="modal">

        <div className="modal-content">
          <button data-testid="modal-close" type="button" onClick={ closeModal }>
            <FiX />
          </button>

          <FiAlertCircle />

          <h1 data-testid="modal-title">{title}</h1>

          <p data-testid="modal-description">{description}</p>
        </div>

      </div>
    </div>
  );
};

export default forwardRef(AppModal);
