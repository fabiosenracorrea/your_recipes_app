import React, { ChangeEvent } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import './styles.css';

interface iPagingProps {
  generator: Array<number>;
  currentPage: number;
  paging: number;
  lastShownPage: number;
  numberOfPages: number;

  handlePageChange(inputChangeEvent: ChangeEvent<HTMLInputElement>): void;
  handlePageDown(): void;
  handlePageUp(): void;
}

const Paging: React.FC<iPagingProps> = ({
  handlePageChange,
  handlePageDown,
  handlePageUp,
  generator,
  currentPage,
  paging,
  lastShownPage,
  numberOfPages,
}) => {
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
};

export default Paging;
