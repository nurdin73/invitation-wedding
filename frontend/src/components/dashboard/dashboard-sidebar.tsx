'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, X, Sparkles } from 'lucide-react';
import { DASHBOARD_NAV_ITEMS, type NavItem, type NavChildItem } from '@/config/dashboard-nav';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/services/api/auth.api';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  user: UserProfile | null;
}

export function DashboardSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  // State untuk menyimpan item accordion yang sedang terbuka (berdasarkan title)
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(() => {
    // Default open jika ada child yang aktif
    const initial: Record<string, boolean> = {};
    for (const item of DASHBOARD_NAV_ITEMS) {
      if (item.children) {
        const hasActiveChild = item.children.some((c) => pathname === c.href);
        if (hasActiveChild || pathname === item.href) {
          initial[item.title] = true;
        }
      }
    }
    return initial;
  });

  const toggleSubmenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
          data-testid="dashboard-sidebar-mobile-backdrop"
        />
      )}

      {/* Sidebar Chassis */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:static',
          // Mobile responsive placement
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          // Desktop width handling
          isCollapsed ? 'md:w-18' : 'md:w-64',
          'w-64'
        )}
        data-testid="dashboard-sidebar"
        data-collapsed={isCollapsed ? 'true' : 'false'}
      >
        {/* Header Branding */}
        <div className="h-14 border-b border-border flex items-center justify-between px-3.5 flex-shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 overflow-hidden"
            data-testid="dashboard-sidebar-brand"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="truncate font-sans text-base font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            )}
          </Link>

          {/* Tombol Tutup pada Drawer Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Tutup menu navigasi"
            data-testid="dashboard-sidebar-mobile-close-btn"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.title}
              item={item}
              pathname={pathname}
              isCollapsed={isCollapsed}
              isMobileOpen={isMobileOpen}
              isOpen={Boolean(openMenus[item.title])}
              onToggle={() => toggleSubmenu(item.title)}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </div>

        {/* Footer Area / User Info Ringkas */}
        {user && (!isCollapsed || isMobileOpen) && (
          <div className="border-t border-border p-3 flex-shrink-0">
            <div className="flex items-center gap-2.5 rounded-lg bg-card-oat p-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user.fullName}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

function SidebarNavItem({
  item,
  pathname,
  isCollapsed,
  isMobileOpen,
  isOpen,
  onToggle,
  onCloseMobile,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isDirectActive = item.href ? pathname === item.href : false;
  const isChildActive = Boolean(item.children?.some((c) => pathname === c.href));
  const isActive = isDirectActive || isChildActive;

  // Tampilan ketika Collapsed (Desktop Only)
  if (isCollapsed && !isMobileOpen) {
    return (
      <div className="relative flex justify-center py-1">
        <Link
          href={item.href || item.children?.[0]?.href || '#'}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
            isActive
              ? 'bg-primary/15 text-primary font-medium'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          title={item.title}
          data-testid={item.dataTestId || `sidebar-collapsed-${item.title}`}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
        </Link>
      </div>
    );
  }

  // Tampilan ketika Expanded atau Mobile Drawer
  return (
    <div className="space-y-1">
      {hasChildren ? (
        <div>
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'w-full flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-muted/60 text-foreground font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            data-testid={item.dataTestId || `sidebar-item-${item.title}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span className="truncate">{item.title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </button>

          {/* Render Child Nav Accordion */}
          {isOpen && item.children && (
            <div className="pl-7 pr-1 pt-1 space-y-1">
              {item.children.map((child: NavChildItem) => {
                const ChildIcon = child.icon;
                const isCurrentChildActive = pathname === child.href;

                return (
                  <Link
                    key={child.title}
                    href={child.href}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors',
                      isCurrentChildActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    data-testid={child.dataTestId || `sidebar-child-${child.title}`}
                  >
                    {ChildIcon && <ChildIcon className="h-4 w-4 flex-shrink-0" />}
                    <span className="truncate">{child.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.href || '#'}
          onClick={onCloseMobile}
          className={cn(
            'flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          data-testid={item.dataTestId || `sidebar-item-${item.title}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
            <span className="truncate">{item.title}</span>
          </div>
          {item.badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-tint text-primary border border-border-soft flex-shrink-0">
              {item.badge}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
