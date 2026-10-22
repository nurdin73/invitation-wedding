import type { LucideIcon } from 'lucide-react';
import {
  HeartHandshake,
  Palette,
  MessageSquareHeart,
  Sparkles,
  Printer,
  CreditCard,
} from 'lucide-react';

export interface NavChildItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  badge?: string;
  dataTestId?: string;
}

export interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavChildItem[];
  dataTestId?: string;
}

export const DASHBOARD_NAV_ITEMS: readonly NavItem[] = [
  {
    title: 'Undangan Saya',
    href: '/dashboard',
    icon: HeartHandshake,
    dataTestId: 'nav-item-invitations',
  },
  {
    title: 'Katalog Tema',
    href: '/templates',
    icon: Palette,
    badge: 'Segera',
    dataTestId: 'nav-item-templates',
  },
  {
    title: 'Buku Tamu & RSVP',
    href: '/rsvp',
    icon: MessageSquareHeart,
    badge: 'Segera',
    dataTestId: 'nav-item-rsvp',
  },
  {
    title: 'Fitur & Media',
    href: '/media',
    icon: Sparkles,
    badge: 'Segera',
    dataTestId: 'nav-item-media',
  },
  {
    title: 'Undangan Cetak PDF',
    href: '/print',
    icon: Printer,
    badge: 'Segera',
    dataTestId: 'nav-item-print',
  },
  {
    title: 'Paket & Tagihan',
    href: '/billing',
    icon: CreditCard,
    dataTestId: 'nav-item-billing',
  },
] as const;
