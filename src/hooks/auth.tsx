import React, {
  createContext, useCallback, useContext, useState,
} from 'react';

interface iUser {
  email: string;
  name?: string;
}

interface iAuthContextProps {
  user: iUser;
  userToken: string;
  signIn(userData: iUser): void;
  signOut(): void;
}

const authContext = createContext<iAuthContextProps>({} as iAuthContextProps);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUserData] = useState(() => {
    let previousUserData = JSON.parse(localStorage.getItem('user'));

    const registeredUser = JSON.parse(localStorage.getItem('userNames')) || {};

    if (previousUserData) {
      const userName = registeredUser[previousUserData.email];

      if (userName) {
        previousUserData = { ...previousUserData, name: userName };
      }

      return previousUserData;
    }

    return {};
  });

  const [userToken, setUserToken] = useState(() => {
    const existentMealsToken = localStorage.getItem('mealsToken');

    if (existentMealsToken) {
      return existentMealsToken;
    }

    return '1';
  });

  const signIn = useCallback(({ email }: iUser) => {
    const userDataToPersist = { email };
    const AUTH_TOKEN = '1';

    setUserData((prevData: iUser) => ({
      ...prevData,
      ...userDataToPersist,
    }));

    setUserToken(AUTH_TOKEN);

    localStorage.setItem('user', JSON.stringify(userDataToPersist));
    localStorage.setItem('mealsToken', AUTH_TOKEN);
    localStorage.setItem('cocktailsToken', AUTH_TOKEN);
  }, []);

  const signOut = useCallback(() => {
    setUserData({});

    localStorage.removeItem('user');
    localStorage.removeItem('mealsToken');
    localStorage.removeItem('cocktailsToken');
    localStorage.removeItem('doneRecipes');
    localStorage.removeItem('favoriteRecipes');
    localStorage.removeItem('inProgressRecipes');
  }, []);

  return (
    <authContext.Provider
      value={ {
        user, userToken, signIn, signOut,
      } }
    >
      {children}
    </authContext.Provider>
  );
};

function useAuth(): iAuthContextProps {
  const context = useContext(authContext);

  if (!context) {
    throw new Error('You must use this hook within its provider');
  }

  return context;
}

export { AuthProvider, useAuth };
