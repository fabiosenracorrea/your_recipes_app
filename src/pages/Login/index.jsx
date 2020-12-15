import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiAlertCircle, FiUser, FiLock } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import AppModal from '../../components/AppModal';

import loginLogo from '../../images/login-logo.png';
import appLogo from '../../images/app-icon.png';

import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef();

  const { signIn } = useAuth();
  const { push } = useHistory();

  const handleSubmit = useCallback((formEvent) => {
    formEvent.preventDefault();

    const validUserData = { email, password };

    signIn(validUserData);

    push('/meals');
  }, [email, password, push, signIn]);

  const handleEmailChange = useCallback(({ target }) => {
    const emailTyped = target.value;

    setEmail(emailTyped);
  }, []);

  const handlePasswordChange = useCallback(({ target }) => {
    const passwordTyped = target.value;

    setPassword(passwordTyped);
  }, []);

  const handleHelpModalOpen = useCallback(() => {
    modalRef.current.openModal();
  }, [modalRef]);

  const userDataIsValid = useMemo(() => {
    const emailRegex = /\w+@(\w+\.)+\w+$/i;
    const emailIsValid = emailRegex.test(email);

    const MIN_PW_LENGTH = 6;
    const passwordIsValid = password.length > MIN_PW_LENGTH;

    return (emailIsValid && passwordIsValid);
  }, [email, password]);

  return (
    <div className="login-page">
      <div className="login-content">
        <img src={ appLogo } alt="Recipes app logo" />

        <form onSubmit={ handleSubmit }>
          <h1>Recipes Login</h1>

          <Input
            placeholder="Your e-mail"
            name="email"
            data-testid="email-input"
            icon={ FiUser }
            value={ email }
            onChange={ handleEmailChange }
          />

          <Input
            data-testid="password-input"
            type="password"
            name="password"
            placeholder="Your password"
            icon={ FiLock }
            value={ password }
            onChange={ handlePasswordChange }
          />

          <button
            type="button"
            className="help-btn"
            data-testid="login-modal"
            onClick={ handleHelpModalOpen }
          >
            Having trouble?
          </button>

          <button
            type="submit"
            className="login-btn"
            data-testid="login-submit-btn"
            disabled={ !userDataIsValid }
          >
            Sign In
          </button>
        </form>

        <Link
          to="/register"
          className="register-fake"
          data-testid="register-link"
        >
          <FiAlertCircle />
          Register
        </Link>
      </div>

      <div className="login-bg">
        <div className="bg">
          <img src={ loginLogo } alt="alternative recipes logo" />
          <h1>Your recipes app</h1>
        </div>
      </div>

      <AppModal
        title="Need help getting in?"
        // eslint-disable-next-line
        description="This is a mock up sign in page, designed conceptually. To get in the application, just input a valid e-mail and a password longer than 6 characters. Happy eating :)"
        ref={ modalRef }
      />
    </div>
  );
}

export default Login;
