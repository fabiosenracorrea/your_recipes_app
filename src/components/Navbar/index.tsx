import React from 'react';
import { Link } from 'react-router-dom';

import drinkIcon from '../../images/drinkIcon.svg';
import exploreIcon from '../../images/exploreIcon.svg';
import mealIcon from '../../images/mealIcon.svg';

import './styles.css';

const Navbar: React.FC = () => {
  return (
    <nav className="app-nav-bar" data-testid="footer">
      <Link to="/cocktails">
        <img data-testid="drinks-bottom-btn" src={ drinkIcon } alt="drinks page" />
      </Link>

      <Link to="/explore">
        <img data-testid="explore-bottom-btn" src={ exploreIcon } alt="explore page" />
      </Link>

      <Link to="/meals">
        <img data-testid="food-bottom-btn" src={ mealIcon } alt="meals page" />
      </Link>
    </nav>
  );
};

export default Navbar;
