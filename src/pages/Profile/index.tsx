import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiHeart, FiCheck, FiLogOut } from 'react-icons/fi';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

import { useAuth } from '../../hooks/auth';

import loginLogo from '../../images/login-logo.png';

import './styles.css';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();

  const { push } = useHistory();

  const handleLogOut = useCallback(() => {
    signOut();

    push('/');
  }, [signOut, push]);

  return (
    <div className="profile-page">
      <Header pageTitle="Profile" />

      <div className="profile-content">
        <div className="user-info-container">

          {!!user.name && (
            <h2>
              <img src={ loginLogo } alt="alternative logo" />

              {user.name}
            </h2>
          )}

          <h3 data-testid="profile-email">{user.email}</h3>
        </div>

        <Link to="/done-recipes" data-testid="profile-done-btn">
          <FiCheck />
          Done Recipes
        </Link>

        <Link to="/favorite-recipes" data-testid="profile-favorite-btn">
          <FiHeart />
          Favorite Recipes
        </Link>

        <div className="logout-container">
          <div className="logout-icon">
            <FiLogOut />
          </div>

          <button
            data-testid="profile-logout-btn"
            type="button"
            onClick={ handleLogOut }
          >
            Logout
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
