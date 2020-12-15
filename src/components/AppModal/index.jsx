import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

import './styles.css';

// eslint-disable-next-line
function AppModal({ title, description }, ref) {
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
    return;
  }

  return (
    <div className="modal-container">
      <div className="modal">

        <div className="modal-content">
          <button type="button" onClick={ closeModal }>
            <FiX />
          </button>

          <FiAlertCircle />

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

      </div>
    </div>
  );
}

export default forwardRef(AppModal);
