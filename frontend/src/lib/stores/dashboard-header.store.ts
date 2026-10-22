import { create } from 'zustand';
import type { LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderActionButton {
  id: string;
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  dataTestId?: string;
}

export interface HeaderActionDropdownItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  dataTestId?: string;
}

export interface HeaderActionDropdown {
  id: string;
  triggerLabel: string;
  triggerVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  triggerIcon?: LucideIcon;
  items: HeaderActionDropdownItem[];
  dataTestId?: string;
}

export type HeaderAction =
  | { type: 'button'; button: HeaderActionButton }
  | { type: 'dropdown'; dropdown: HeaderActionDropdown };

export interface DashboardHeaderState {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  showBackButton: boolean;
  backButtonHref?: string;
  onBackClick?: () => void;
  actions: HeaderAction[];
  setHeader: (config: Partial<Omit<DashboardHeaderState, 'setHeader' | 'resetHeader'>>) => void;
  resetHeader: () => void;
}

const initialState: Omit<DashboardHeaderState, 'setHeader' | 'resetHeader'> = {
  title: '',
  breadcrumbs: [],
  showBackButton: false,
  backButtonHref: undefined,
  onBackClick: undefined,
  actions: [],
};

export const useDashboardHeaderStore = create<DashboardHeaderState>((set) => ({
  ...initialState,
  setHeader: (config) =>
    set((state) => ({
      ...state,
      ...config,
    })),
  resetHeader: () => set(initialState),
}));
