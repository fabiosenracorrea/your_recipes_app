import React, {
  useCallback, useRef, useState, useMemo, FormEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { BsHouseFill } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';

import { useAuth } from '../../hooks/auth';
import { useSearch } from '../../hooks/search';

import { tRecipeTypes, iSearchOptions } from '../../@types/appTypes';

import './styles.css';

const searchOptions = [
  {
    name: 'Ingredients',
    test: 'ingredient',
    value: 'ingredients',
  },
  {
    name: 'Name',
    test: 'name',
    value: 'name',
  },
  {
    name: 'First Letter',
    test: 'first-letter',
    value: 'first_letter',
  },
];

const validOptions = ['ingredients', 'name', 'first_letter'];

interface iHeaderProps {
  pageType: tRecipeTypes;
  pageTitle: string;
  showSearch?: boolean;
}

const Header: React.FC<iHeaderProps> = ({ pageType = 'meals', pageTitle, showSearch = false }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchBarShowing, setSearchBarShowing] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  const { userToken } = useAuth();
  const { appSearch } = useSearch();
  const { push } = useHistory();

  const handleSearchIconClick = useCallback(() => {
    setSearchBarShowing((oldSearchBarShowingValue) => !oldSearchBarShowingValue);
  }, []);

  const handleRadioChange = useCallback(({ target }) => {
    setRadioValue(target.value);
  }, []);

  const handleRecipeSearch = useCallback(async (formEvent: FormEvent) => {
    formEvent.preventDefault();

    const search = searchInputRef.current?.value;
    const option = radioValue;

    if (!search || !option || !validOptions.includes(option)) {
      return;
    }

    if (option === 'first_letter' && search.length !== 1) {
      alert('Your search should have only 1 (one) character');

      return;
    }

    const infoToSearch = { option, value: search, token: userToken } as iSearchOptions;

    const singleResponseID = await appSearch(pageType, infoToSearch);

    if (singleResponseID) {
      push(`${pageType}/${singleResponseID}`);
    }
  }, [push, appSearch, searchInputRef, radioValue, userToken, pageType]);

  const parsedTitle = useMemo(() => {
    const headerWords = pageTitle.split(' ');

    const namesCapitalized = headerWords.map((word) => (
      word.charAt(1 - 1).toUpperCase() + word.slice(1)
    ));

    const wordsCapitalized = namesCapitalized.join(' ');

    return wordsCapitalized;
  }, [pageTitle]);

  return (
    <div className="header-container">
      <header className="app-header">
        <Link className="profile-link" to="/profile" data-testid="profile-top-btn">
          <AiOutlineUser />
        </Link>

        <span data-testid="page-title">{ parsedTitle }</span>

        {showSearch
          ? (
            <button
              type="button"
              onClick={ handleSearchIconClick }
              data-testid="search-top-btn"
            >
              <FiSearch />
            </button>
          ) : (
            <Link to={ `/${pageType}` }>
              <BsHouseFill size={ 24 } color="white" />
            </Link>
          )}
      </header>

      {searchBarShowing && (
        <div className="search-bar-container">
          <form onSubmit={ handleRecipeSearch }>

            <div className="search-input-container">

              <input
                type="text"
                data-testid="search-input"
                placeholder="Enter your search"
                ref={ searchInputRef }
              />

              <button
                type="submit"
                data-testid="exec-search-btn"
              >
                <FiSearch />
              </button>

            </div>

            <div className="radio-type-container">

              {searchOptions.map(({ name, test, value }) => (
                <div key={ `${name}-${test}` } className="radio-container">
                  <label data-testid={ `${test}-search-radio` } htmlFor={ value }>
                    <input
                      type="radio"
                      onChange={ handleRadioChange }
                      name="searchOption"
                      id={ value }
                      value={ value }
                    />
                    <span className="checkmark" />
                    { name }
                  </label>
                </div>
              ))}

            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default Header;
