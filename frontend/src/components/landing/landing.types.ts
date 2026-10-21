export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  badge?: string;
}

export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: 'minimalist' | 'floral' | 'traditional' | 'luxury';
  badge: string;
  demoSlug: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface TestimonialItem {
  id: string;
  names: string;
  location: string;
  date: string;
  quote: string;
  rating: number;
  templateName?: string;
  avatarUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}
