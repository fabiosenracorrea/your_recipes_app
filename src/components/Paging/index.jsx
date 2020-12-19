import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PropTypes from 'prop-types';

import './styles.css';

function Paging({
  handlePageChange,
  handlePageDown,
  handlePageUp,
  generator,
  currentPage,
  paging,
  lastShownPage,
  numberOfPages,
}) {
  return (
    <div className="paging-container">
      <button
        type="button"
        onClick={ handlePageDown }
        disabled={ paging === 1 }
      >
        <FiChevronLeft />
      </button>

      {generator.map((page) => (
        <label
          key={ `${page}-${Math.random()}` }
          className="single-paging"
          htmlFor={ `page-${page}` }
        >
          <input
            type="radio"
            name="page"
            id={ `page-${page}` }
            value={ page }
            onChange={ handlePageChange }
            checked={ currentPage === page }
          />
          <span>
            {page}
          </span>
        </label>
      ))}

      <button
        type="button"
        onClick={ handlePageUp }
        disabled={ lastShownPage === numberOfPages }
      >
        <FiChevronRight />
      </button>
    </div>
  );
}

Paging.defaultProps = {
  lastShownPage: 0,
};

Paging.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  handlePageDown: PropTypes.func.isRequired,
  handlePageUp: PropTypes.func.isRequired,

  generator: PropTypes.arrayOf(
    PropTypes.number,
  ).isRequired,

  currentPage: PropTypes.number.isRequired,
  paging: PropTypes.number.isRequired,
  lastShownPage: PropTypes.number,
  numberOfPages: PropTypes.number.isRequired,
};

export default Paging;
