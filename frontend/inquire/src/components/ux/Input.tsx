import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rounded?: 'top' | 'bottom' | 'none' | 'all';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, rounded = 'all', className = '', ...props }, ref) => {
    const roundedClasses = {
      top: 'rounded-t-md rounded-b-none',
      bottom: 'rounded-b-md rounded-t-none',
      none: 'rounded-none',
      all: 'rounded-md',
    };

    return (
      <div>
        <input
          ref={ref}
          className={`appearance-none relative block w-full px-3 py-2 border bg-slate-900 ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              : 'border-violet-600 focus:border-violet-500 focus:ring-violet-500'
          } placeholder-violet-400 text-violet-100 focus:outline-none focus:z-10 sm:text-sm ${roundedClasses[rounded]} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;

