import * as React from 'react';
import type { SectionType, SectionRenderProps } from './types';
import { HeroClassic } from './templates/hero/hero-classic';
import { QuoteSacred } from './templates/quote/quote-sacred';
import { CoupleSideBySide } from './templates/couple/couple-side-by-side';
import { EventCards } from './templates/event/event-cards';
import { GalleryGrid } from './templates/gallery/gallery-grid';
import { GallerySlider } from './templates/gallery/gallery-slider';
import { GalleryCards } from './templates/gallery/gallery-cards';
import { RsvpInteractive } from './templates/rsvp/rsvp-interactive';
import { GiftBankCards } from './templates/gift/gift-bank-cards';
import { FooterClosing } from './templates/footer/footer-closing';
import { StoryTimeline } from './templates/story/story-timeline';

export type AnySectionComponent = React.ComponentType<SectionRenderProps<SectionType>>;

export const SECTION_REGISTRY: Record<SectionType, Record<string, AnySectionComponent>> = {
  hero: {
    classic: HeroClassic as AnySectionComponent,
    default: HeroClassic as AnySectionComponent,
  },
  quote: {
    sacred: QuoteSacred as AnySectionComponent,
    default: QuoteSacred as AnySectionComponent,
  },
  couple: {
    'side-by-side': CoupleSideBySide as AnySectionComponent,
    default: CoupleSideBySide as AnySectionComponent,
  },
  event: {
    cards: EventCards as AnySectionComponent,
    timeline: EventCards as AnySectionComponent,
    default: EventCards as AnySectionComponent,
  },
  story: {
    timeline: StoryTimeline as AnySectionComponent,
    default: StoryTimeline as AnySectionComponent,
  },
  gallery: {
    grid: GalleryGrid as AnySectionComponent,
    slider: GallerySlider as AnySectionComponent,
    cards: GalleryCards as AnySectionComponent,
    default: GalleryGrid as AnySectionComponent,
  },
  rsvp: {
    interactive: RsvpInteractive as AnySectionComponent,
    default: RsvpInteractive as AnySectionComponent,
  },
  gift: {
    'bank-cards': GiftBankCards as AnySectionComponent,
    default: GiftBankCards as AnySectionComponent,
  },
  footer: {
    closing: FooterClosing as AnySectionComponent,
    default: FooterClosing as AnySectionComponent,
  },
};

const FallbackSection: React.FC<SectionRenderProps> = ({ id, copy }) => {
  const title = copy && typeof copy === 'object' && 'title' in copy ? String(copy.title) : 'Unknown';
  return (
    <div
      data-testid={`section-fallback-${id}`}
      className="p-6 text-center text-xs opacity-50 border border-dashed border-current/20 my-2"
    >
      Bagian tidak ditemukan ({id} - {title})
    </div>
  );
};

export function resolveSectionComponent(type: SectionType, variant = 'default'): AnySectionComponent {
  const sectionVariants = SECTION_REGISTRY[type];
  if (!sectionVariants) {
    return FallbackSection as AnySectionComponent;
  }
  return sectionVariants[variant] || sectionVariants.default || (FallbackSection as AnySectionComponent);
}
