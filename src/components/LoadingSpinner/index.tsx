import React from 'react';

import './styles.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner" />
      <h4>Loading recipes...</h4>
    </div>
  );
};

export default LoadingSpinner;
