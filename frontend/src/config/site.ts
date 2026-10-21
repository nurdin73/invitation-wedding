export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'plannikah',
  description: 'Platform SaaS Undangan Pernikahan Digital Elegan',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const APP_NAME = siteConfig.name;
