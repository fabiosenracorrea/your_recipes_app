import React, { useCallback, useMemo, useRef, useState, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiLock, FiInfo } from 'react-icons/fi';

import Input from '../../components/Input';
import AppModal, { ModalRef } from '../../components/AppModal';

import loginLogo from '../../images/login-logo.png';
import appLogo from '../../images/app-icon.png';

import './styles.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef<ModalRef>(null);

  const { push } = useHistory();

  const handleSubmit = useCallback((formEvent) => {
    formEvent.preventDefault();

    const previousRegister = JSON.parse(localStorage.getItem('userNames') || '{}');

    previousRegister[email] = name;

    localStorage.setItem('userNames', JSON.stringify(previousRegister));

    push('/');
  }, [email, push, name]);

  const handleNameChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const nameTyped = target.value;

    setName(nameTyped);
  }, []);

  const handleEmailChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const emailTyped = target.value;

    setEmail(emailTyped);
  }, []);

  const handlePasswordChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    const passwordTyped = target.value;

    setPassword(passwordTyped);
  }, []);

  const handleHelpModalOpen = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.openModal();
    }
  }, [modalRef]);

  const userDataIsValid = useMemo(() => {
    const emailRegex = /\w+@(\w+\.)+\w+$/i;
    const emailIsValid = emailRegex.test(email);

    const MIN_PW_LENGTH = 6;
    const passwordIsValid = password.length > MIN_PW_LENGTH;

    return (emailIsValid && passwordIsValid && name);
  }, [email, password, name]);

  return (
    <div className="register-page">
      <div className="register-bg">
        <div className="bg">
          <img src={ loginLogo } alt="alternative recipes logo" />
          <h1>Your recipes app</h1>
        </div>
      </div>

      <div className="register-content">
        <img src={ appLogo } alt="Recipes app logo" />

        <form onSubmit={ handleSubmit }>
          <h1>Crete an account</h1>

          <Input
            placeholder="Your name"
            name="name"
            data-testid="name-input"
            icon={ FiInfo }
            value={ name }
            onChange={ handleNameChange }
          />

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
            data-testid="register-modal"
            onClick={ handleHelpModalOpen }
          >
            Disclaimer
          </button>

          <button
            type="submit"
            className="register-btn"
            data-testid="register-submit-btn"
            disabled={ !userDataIsValid }
          >
            Register
          </button>
        </form>

        <Link
          to="/"
          className="register-fake"
          data-testid="back-link"
        >
          <FiArrowLeft />
          Back to Login
        </Link>
      </div>

      <AppModal
        title="This is a fake register page!"
        // eslint-disable-next-line
        description="Just like the sign in page, this is just the concept. There's only an easter egg related to this page. Can you find it? Happy eating :)"
        ref={ modalRef }
      />

    </div>
  );
};

export default Register;
