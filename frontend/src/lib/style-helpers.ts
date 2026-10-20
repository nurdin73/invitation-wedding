export interface ThemeConfig {
  palette?: string;
  primaryColor?: string;
  secondaryColor?: string;
  canvasBackground?: string;
  headingFont?: string;
  bodyFont?: string;
}

export function generateCanvasStyleVars(themeConfig?: ThemeConfig): React.CSSProperties {
  if (!themeConfig) return {};

  return {
    '--inv-primary': themeConfig.primaryColor || '#B45309',
    '--inv-secondary': themeConfig.secondaryColor || '#D97706',
    '--inv-bg': themeConfig.canvasBackground || '#FFFBEB',
    '--inv-font-heading': themeConfig.headingFont || 'Playfair Display, serif',
    '--inv-font-body': themeConfig.bodyFont || 'Plus Jakarta Sans, sans-serif',
  } as React.CSSProperties;
}
