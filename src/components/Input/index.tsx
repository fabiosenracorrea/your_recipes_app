import React, {
  useState,
  useCallback,
  useEffect,
  InputHTMLAttributes,
} from 'react';
import { IconBaseProps } from 'react-icons';

import './styles.css';

interface iInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  error: boolean;
  value?: string;
}

const Input: React.FC<iInputProps> = ({ name, icon: Icon, error, value, ...rest }) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [hasText, setHasText] = useState(false);

  useEffect(() => {
    setHasText(!!value);
  }, [value]);

  const handleFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    setHasFocus(false);

    setHasText(!!value);
  }, [value]);

  return (
    <div
      className={ `
        input-container
        ${hasFocus ? 'has-focus' : ''}
        ${error ? 'has-error' : ''}
        ${hasText ? 'has-text' : ''}
      ` }
      data-testid="input-container"
    >
      {Icon && <Icon size={ 24 } />}

      <input
        className="custom-input"
        name={ name }
        value={ value }
        onFocus={ handleFocus }
        onBlur={ handleBlur }
        data-testid="input-elm"
        { ...rest }
      />
    </div>
  );
};

export default Input;
