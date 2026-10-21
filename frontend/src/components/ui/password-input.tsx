'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/components/ui/input';

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  toggleAriaLabel?: {
    show?: string;
    hide?: string;
  };
  'data-testid'?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      hasError,
      disabled,
      toggleAriaLabel = {
        show: 'Tampilkan kata sandi',
        hide: 'Sembunyikan kata sandi',
      },
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div
        className="relative w-full"
        data-testid={dataTestId ? `${dataTestId}-wrapper` : 'password-input-wrapper'}
      >
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          hasError={hasError}
          className={cn('pr-10', className)}
          data-testid={dataTestId}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer"
          aria-label={showPassword ? toggleAriaLabel.hide : toggleAriaLabel.show}
          data-testid={dataTestId ? `${dataTestId}-toggle` : 'password-input-toggle'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
