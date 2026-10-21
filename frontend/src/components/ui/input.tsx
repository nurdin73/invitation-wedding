import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  'data-testid'?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', hasError, 'data-testid': dataTestId, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
          hasError
            ? 'border-destructive ring-1 ring-destructive/30 focus-visible:ring-destructive focus-visible:border-destructive'
            : 'border-border focus-visible:ring-primary focus-visible:border-primary',
          className
        )}
        ref={ref}
        data-testid={dataTestId}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
