export type SectionType =
  | 'hero'
  | 'quote'
  | 'couple'
  | 'event'
  | 'story'
  | 'gallery'
  | 'rsvp'
  | 'gift'
  | 'footer';

// ─── 1. KONTEN KANONIK (SINGLE SOURCE OF TRUTH) ─────────────────────────────

export interface PersonProfile {
  fullName: string;
  nickname: string;
  parents: string;
  instagram?: string;
  photoUrl?: string;
}

export interface EventItem {
  id: string;
  eventName: string; // e.g. "Akad Nikah", "Resepsi Pernikahan"
  date: string; // 'YYYY-MM-DD'
  timeRange: string; // e.g. "08:00 - 10:00 WIB"
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
}

export interface StoryTimelineItem {
  id: string;
  year: string;
  title: string;
  story: string;
}

export interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
}

export interface GiftConfig {
  accounts: BankAccountItem[];
  giftAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
}

export interface MusicConfig {
  audioUrl?: string;
  isAutoplay: boolean;
}

export interface QuoteConfig {
  quoteText: string;
  sourceText: string;
}

export interface InvitationContent {
  couple: {
    groom: PersonProfile;
    bride: PersonProfile;
  };
  events: EventItem[];
  quote: QuoteConfig;
  story: StoryTimelineItem[];
  gallery: GalleryImageItem[];
  gift: GiftConfig;
  music: MusicConfig;
}

// ─── 2. SEKSI LAYOUT & COPY (TEKS KHAS TIAP SEKSI) ──────────────────────────

export interface HeroSectionCopy {
  subtitle?: string;
  welcomeNote?: string;
}

export interface QuoteSectionCopy {
  title?: string;
}

export interface CoupleSectionCopy {
  title?: string;
  subtitle?: string;
}

export interface EventSectionCopy {
  title?: string;
  subtitle?: string;
}

export interface StorySectionCopy {
  title?: string;
  subtitle?: string;
}

export interface GallerySectionCopy {
  title?: string;
  subtitle?: string;
}

export interface RsvpSectionCopy {
  title?: string;
  subtitle?: string;
  description?: string;
  showAttendanceCount?: boolean;
}

export interface GiftSectionCopy {
  title?: string;
  subtitle?: string;
}

export interface FooterSectionCopy {
  closingText?: string;
  thankYouNote?: string;
}

export type SectionCopyMap = {
  hero: HeroSectionCopy;
  quote: QuoteSectionCopy;
  couple: CoupleSectionCopy;
  event: EventSectionCopy;
  story: StorySectionCopy;
  gallery: GallerySectionCopy;
  rsvp: RsvpSectionCopy;
  gift: GiftSectionCopy;
  footer: FooterSectionCopy;
};

// ─── 3. STRUKTUR NODE & PROPS RENDERER ──────────────────────────────────────

export interface SectionNode<TType extends SectionType = SectionType> {
  id: string;
  type: TType;
  variant: string;
  isVisible: boolean;
  copy: SectionCopyMap[TType];
}

export interface ThemeConfig {
  paletteId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  canvasBackground?: string;
  headingFont?: string;
  bodyFont?: string;
  audioUrl?: string;
  isAutoplayMusic?: boolean;
}

export interface SectionRenderProps<TType extends SectionType = SectionType> {
  id: string;
  content: InvitationContent;
  copy: SectionCopyMap[TType];
  variant?: string;
  themeConfig?: ThemeConfig;
  isEditor?: boolean;
}
