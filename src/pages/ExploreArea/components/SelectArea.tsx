import React, { ChangeEvent } from 'react';

import { useExplore } from '../../../hooks/explore';

interface iSelectProps {
  areaSelected: string;
  handleAreaChange(inputChangeEvent: ChangeEvent<HTMLSelectElement>): void;
}

const SelectArea: React.FC<iSelectProps> = ({ areaSelected, handleAreaChange }) => {
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
};

export default SelectArea;
