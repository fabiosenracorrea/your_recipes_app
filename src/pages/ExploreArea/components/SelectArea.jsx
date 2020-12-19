import React from 'react';
import PropTypes from 'prop-types';

import { useExplore } from '../../../hooks/explore';

function SelectArea({ areaSelected, handleAreaChange }) {
  const { foodAreas } = useExplore();

  return (
    <div className="area-select-container">
      <h3>Choose a category:</h3>

      <select
        name="area"
        id="area"
        value={ areaSelected }
        onChange={ handleAreaChange }
        data-testid="explore-by-area-dropdown"
      >
        <option value="All" data-testid="All-option">All</option>

        {foodAreas.map((area) => (
          <option
            key={ area }
            value={ area }
            data-testid={ `${area}-option` }
          >
            {area}

          </option>
        ))}
      </select>
    </div>
  );
}

SelectArea.propTypes = {
  areaSelected: PropTypes.string.isRequired,
  handleAreaChange: PropTypes.func.isRequired,
};

export default SelectArea;
