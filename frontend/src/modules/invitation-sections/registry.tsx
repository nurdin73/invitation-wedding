import * as React from 'react';
import type { SectionType, SectionRenderProps } from './types';
import { HeroClassic } from './templates/hero/hero-classic';
import { QuoteSacred } from './templates/quote/quote-sacred';
import { CoupleSideBySide } from './templates/couple/couple-side-by-side';
import { EventCards } from './templates/event/event-cards';
import { GalleryGrid } from './templates/gallery/gallery-grid';
import { RsvpInteractive } from './templates/rsvp/rsvp-interactive';
import { GiftBankCards } from './templates/gift/gift-bank-cards';
import { FooterClosing } from './templates/footer/footer-closing';

// Type-safe registry mapping
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySectionComponent = React.FC<SectionRenderProps<any>>;

export const SECTION_REGISTRY: Record<SectionType, Record<string, AnySectionComponent>> = {
  hero: {
    classic: HeroClassic,
    default: HeroClassic,
  },
  quote: {
    sacred: QuoteSacred,
    default: QuoteSacred,
  },
  couple: {
    'side-by-side': CoupleSideBySide,
    default: CoupleSideBySide,
  },
  event: {
    cards: EventCards,
    timeline: EventCards,
    default: EventCards,
  },
  story: {
    default: QuoteSacred,
  },
  gallery: {
    grid: GalleryGrid,
    default: GalleryGrid,
  },
  rsvp: {
    interactive: RsvpInteractive,
    default: RsvpInteractive,
  },
  gift: {
    'bank-cards': GiftBankCards,
    default: GiftBankCards,
  },
  footer: {
    closing: FooterClosing,
    default: FooterClosing,
  },
};

const FallbackSection: React.FC<SectionRenderProps> = ({ id, data }) => (
  <div
    data-testid={`section-fallback-${id}`}
    className="p-6 text-center text-xs opacity-50 border border-dashed border-current/20 my-2"
  >
    Bagian tidak ditemukan ({id} - {data?.title || 'Unknown'})
  </div>
);

export function resolveSectionComponent(type: SectionType, variant = 'default'): AnySectionComponent {
  const sectionVariants = SECTION_REGISTRY[type];
  if (!sectionVariants) {
    return FallbackSection;
  }
  return sectionVariants[variant] || sectionVariants.default || FallbackSection;
}
