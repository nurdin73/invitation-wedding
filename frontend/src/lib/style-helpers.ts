import type * as React from 'react';
import type { ThemeConfig } from '@/modules/invitation-sections/types';

export interface ThemePalettePreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  canvasBackground: string;
}

export const THEME_PALETTES: ThemePalettePreset[] = [
  {
    id: 'dusty-rose',
    name: 'Dusty Rose (Default)',
    primaryColor: '#B86B70',
    secondaryColor: '#DFB15B',
    canvasBackground: '#FAF8F5',
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Sand',
    primaryColor: '#B45309',
    secondaryColor: '#DFB15B',
    canvasBackground: '#FFFBEB',
  },
  {
    id: 'soft-sage',
    name: 'Soft Sage Botanical',
    primaryColor: '#58755E',
    secondaryColor: '#DFB15B',
    canvasBackground: '#F4F7F4',
  },
  {
    id: 'dark-espresso',
    name: 'Midnight Luxury',
    primaryColor: '#D48D92',
    secondaryColor: '#DFB15B',
    canvasBackground: '#1C1715',
  },
];

export const FONT_OPTIONS_HEADING = [
  { label: 'Playfair Display (Serif)', value: 'Playfair Display, serif' },
  { label: 'Cormorant Garamond (Editorial)', value: 'Cormorant Garamond, serif' },
  { label: 'Cinzel (Classical)', value: 'Cinzel, serif' },
  { label: 'Plus Jakarta Sans (Modern)', value: 'Plus Jakarta Sans, sans-serif' },
];

export const FONT_OPTIONS_BODY = [
  { label: 'Plus Jakarta Sans (Clean)', value: 'Plus Jakarta Sans, sans-serif' },
  { label: 'Inter (Neutral)', value: 'Inter, sans-serif' },
  { label: 'Lora (Serif)', value: 'Lora, serif' },
];

export function generateCanvasStyleVars(themeConfig?: ThemeConfig): React.CSSProperties {
  if (!themeConfig) return {};

  return {
    '--inv-primary': themeConfig.primaryColor || '#B86B70',
    '--inv-secondary': themeConfig.secondaryColor || '#DFB15B',
    '--inv-bg': themeConfig.canvasBackground || '#FAF8F5',
    '--inv-font-heading': themeConfig.headingFont || 'Playfair Display, serif',
    '--inv-font-body': themeConfig.bodyFont || 'Plus Jakarta Sans, sans-serif',
  } as React.CSSProperties;
}
