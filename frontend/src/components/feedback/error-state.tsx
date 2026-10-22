import * as React from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Compass, ShieldAlert } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export interface ErrorStateProps {
  code?: string | number;
  title: string;
  description: string;
  variant?: 'landing' | 'dashboard';
  badgeLabel?: string;
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
  errorDetails?: string | null;
  testIdPrefix?: string;
  className?: string;
}

function resolveDefaultIcon(code?: string | number) {
  const codeStr = String(code);
  if (codeStr === '404') {
    return <Compass className="w-10 h-10 text-primary" aria-hidden="true" />;
  }
  if (codeStr === '403') {
    return <ShieldAlert className="w-10 h-10 text-primary" aria-hidden="true" />;
  }
  if (codeStr === '500') {
    return <AlertTriangle className="w-10 h-10 text-destructive" aria-hidden="true" />;
  }
  return <AlertCircle className="w-10 h-10 text-primary" aria-hidden="true" />;
}

export function ErrorState({
  code = '404',
  title,
  description,
  variant = 'landing',
  badgeLabel,
  primaryAction,
  secondaryAction,
  errorDetails,
  testIdPrefix = 'error',
  className,
}: ErrorStateProps) {
  const isDashboard = variant === 'dashboard';

  const renderActionButton = (action: ErrorAction, key: string, isPrimary: boolean) => {
    const buttonVariant = action.variant ?? (isPrimary ? 'default' : 'outline');
    const content = (
      <>
        {action.icon}
        <span>{action.label}</span>
      </>
    );

    if (action.href) {
      return (
        <Link
          key={key}
          href={action.href}
          data-testid={`${testIdPrefix}-${key}-link`}
          className={cn(buttonVariants({ variant: buttonVariant }), 'gap-2 min-w-[150px]')}
        >
          {content}
        </Link>
      );
    }

    return (
      <Button
        key={key}
        type="button"
        variant={buttonVariant}
        onClick={action.onClick}
        data-testid={`${testIdPrefix}-${key}-button`}
        className="gap-2 min-w-[150px]"
      >
        {content}
      </Button>
    );
  };

  return (
    <div
      data-testid={`${testIdPrefix}-container`}
      className={cn(
        'w-full flex-1 flex flex-col items-center justify-center text-center',
        isDashboard
          ? 'h-full min-h-[480px] rounded-2xl border border-border bg-card p-8 sm:p-16 shadow-sm my-0'
          : 'py-16 sm:py-24 px-6 sm:px-12 lg:px-16',
        className
      )}
    >
      {/* Decorative Icon Glow Badge */}
      <div
        data-testid={`${testIdPrefix}-icon-wrapper`}
        className="relative mb-6 flex items-center justify-center"
      >
        <div className="absolute -inset-2 rounded-full bg-accent-tint blur-md opacity-80" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border-soft bg-card shadow-sm">
          {resolveDefaultIcon(code)}
        </div>
      </div>

      {/* Numerical Code Badge */}
      <div
        data-testid={`${testIdPrefix}-code-badge`}
        className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-border-soft bg-accent-tint/60 text-xs font-mono font-semibold tracking-wider text-primary"
      >
        <span>{badgeLabel || `ERROR ${code}`}</span>
      </div>

      {/* Heading (Playfair Display for h1 / h2) */}
      {isDashboard ? (
        <h2
          data-testid={`${testIdPrefix}-title`}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>
      ) : (
        <h1
          data-testid={`${testIdPrefix}-title`}
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h1>
      )}

      {/* Description (Plus Jakarta Sans) */}
      <p
        data-testid={`${testIdPrefix}-description`}
        className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg"
      >
        {description}
      </p>

      {/* Optional Technical Details / Correlation ID */}
      {errorDetails ? (
        <div
          data-testid={`${testIdPrefix}-technical-details`}
          className="mt-4 w-full max-w-md rounded-lg border border-border bg-secondary/40 p-3 text-left"
        >
          <div className="text-[11px] font-mono text-muted-caption uppercase tracking-wider mb-1">
            Detail Teknis / Digest
          </div>
          <pre className="text-xs font-mono text-foreground break-all whitespace-pre-wrap">
            {errorDetails}
          </pre>
        </div>
      ) : null}

      {/* Interactive Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div
          data-testid={`${testIdPrefix}-actions-group`}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          {primaryAction && renderActionButton(primaryAction, 'primary', true)}
          {secondaryAction && renderActionButton(secondaryAction, 'secondary', false)}
        </div>
      )}
    </div>
  );
}
