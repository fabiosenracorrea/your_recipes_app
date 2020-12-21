import React, { ChangeEvent } from 'react';

import './styles.css';

const filterOptions = [
  {
    value: 'All',
    test: 'all',
    display: 'All',
  },
  {
    value: 'meals',
    test: 'food',
    display: 'Meals',
  },
  {
    value: 'cocktails',
    test: 'drink',
    display: 'Cocktails',
  },
];

interface iFoodDrinkFilterProps {
  handleFilterChange(inputChangeEvent: ChangeEvent<HTMLInputElement>): void;
  currentFilter: string;
}

const FoodDrinkFilter: React.FC<iFoodDrinkFilterProps> = (
  { handleFilterChange, currentFilter },
) => {
  return (
    <div className="food-drink-filters">
      <div className="filters-container">
        {filterOptions.map((filterOption) => (
          <div className="label-container" key={ filterOption.value }>
            <input
              type="radio"
              name="filter"
              id={ filterOption.value }
              value={ filterOption.value }
              checked={ currentFilter === filterOption.value }
              onChange={ handleFilterChange }
            />

            <label
              htmlFor={ filterOption.value }
              data-testid={ `filter-by-${filterOption.test}-btn` }
            >
              {filterOption.display}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodDrinkFilter;
