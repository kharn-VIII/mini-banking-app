import { forwardRef } from 'react';
import Input from '../ux/Input';

interface EmailInputProps {
  error?: string;
  rounded?: 'top' | 'bottom' | 'none' | 'all';
  placeholder?: string;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, rounded = 'all', placeholder = 'Email address', ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        error={error}
        rounded={rounded}
        {...props}
      />
    );
  },
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;

