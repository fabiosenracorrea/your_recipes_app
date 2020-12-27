import React from 'react';
import { Link } from 'react-router-dom';
import { BiDrink, BiFoodMenu } from 'react-icons/bi';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

import './styles.css';

const Explore: React.FC = () => {
  return (
    <div className="explore-page">
      <Header pageTitle="Explore" />
      <Navbar />

      <h1>Explore even more delicious recipes!</h1>

      <div className="explore-content">
        <Link
          to="/explore/meals"
          data-testid="explore-food"
        >
          <BiFoodMenu />
          Explore
          <br />

          Meals
        </Link>

        <Link
          to="/explore/cocktails"
          data-testid="explore-drinks"
        >
          <BiDrink />
          Explore
          <br />
          Drinks
        </Link>
      </div>

    </div>
  );
};

export default Explore;
