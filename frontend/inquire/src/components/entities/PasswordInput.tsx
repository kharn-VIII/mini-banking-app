import { forwardRef } from 'react';
import Input from '../ux/Input';

interface PasswordInputProps {
  error?: string;
  rounded?: 'top' | 'bottom' | 'none' | 'all';
  placeholder?: string;
  autoComplete?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      error,
      rounded = 'all',
      placeholder = 'Password',
      autoComplete = 'current-password',
      ...props
    },
    ref,
  ) => {
    return (
      <Input
        ref={ref}
        type="password"
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={error}
        rounded={rounded}
        {...props}
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

