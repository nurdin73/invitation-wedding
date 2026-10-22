'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDashboardHeaderStore,
  type HeaderAction,
} from '@/lib/stores/dashboard-header.store';

export function DashboardBreadcrumbBar() {
  const router = useRouter();
  const {
    title,
    breadcrumbs,
    showBackButton,
    backButtonHref,
    onBackClick,
    actions,
  } = useDashboardHeaderStore();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (backButtonHref) {
      router.push(backButtonHref);
      return;
    }
    router.back();
  };

  const hasContent = title || breadcrumbs.length > 0 || showBackButton || actions.length > 0;
  if (!hasContent) {
    return null;
  }

  return (
    <div
      className="min-h-[56px] border-b border-border bg-card px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10"
      data-testid="dashboard-breadcrumb-bar"
    >
      {/* Sisi Kiri: Tombol Back, Breadcrumbs, & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Kembali"
            data-testid="dashboard-breadcrumb-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-col min-w-0">
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5 overflow-hidden"
              data-testid="dashboard-breadcrumb-trail"
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${idx}`}>
                    {idx > 0 && <ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-foreground/40" />}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={`truncate max-w-[150px] sm:max-w-[240px] ${isLast ? 'font-medium text-foreground' : ''}`}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {title && (
            <h1
              className="text-lg sm:text-xl font-semibold tracking-tight text-foreground truncate"
              data-testid="dashboard-breadcrumb-title"
            >
              {title}
            </h1>
          )}
        </div>
      </div>

      {/* Sisi Kanan: Action Buttons (Berjajar ataupun Dropdown) */}
      {actions.length > 0 && (
        <div
          className="flex items-center gap-2 flex-wrap ml-auto"
          data-testid="dashboard-breadcrumb-actions"
        >
          {actions.map((action, idx) => (
            <ActionRenderer key={`action-${idx}`} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActionRenderer({ action }: { action: HeaderAction }) {
  const router = useRouter();

  if (action.type === 'button') {
    const btn = action.button;
    const IconComponent = btn.icon;

    const handleClick = () => {
      if (btn.onClick) {
        btn.onClick();
      } else if (btn.href) {
        router.push(btn.href);
      }
    };

    return (
      <Button
        key={btn.id}
        variant={btn.variant || 'default'}
        size={btn.size || 'sm'}
        disabled={btn.disabled}
        onClick={handleClick}
        className="gap-1.5 text-xs font-medium"
        data-testid={btn.dataTestId || `action-btn-${btn.id}`}
      >
        {IconComponent && <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />}
        <span>{btn.label}</span>
      </Button>
    );
  }

  if (action.type === 'dropdown') {
    const dd = action.dropdown;
    const TriggerIcon = dd.triggerIcon || ChevronDown;

    return (
      <DropdownMenu key={dd.id}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={dd.triggerVariant || 'outline'}
            size="sm"
            className="gap-1.5 text-xs font-medium"
            data-testid={dd.dataTestId || `action-dropdown-trigger-${dd.id}`}
          >
            <span>{dd.triggerLabel}</span>
            <TriggerIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
          data-testid={`action-dropdown-content-${dd.id}`}
        >
          {dd.items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <DropdownMenuItem
                key={item.id}
                disabled={item.disabled}
                onClick={item.onClick}
                className={item.destructive ? 'text-destructive focus:text-destructive' : ''}
                data-testid={item.dataTestId || `dropdown-item-${item.id}`}
              >
                {ItemIcon && <ItemIcon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />}
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
