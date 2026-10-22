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

export interface BaseSectionData {
  title?: string;
  subtitle?: string;
}

export interface HeroSectionData extends BaseSectionData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  heroImageUrl?: string;
  welcomeNote?: string;
}

export interface QuoteSectionData extends BaseSectionData {
  quoteText: string;
  sourceText: string;
}

export interface CoupleSectionData extends BaseSectionData {
  groomFullName: string;
  groomNickname: string;
  groomParents: string;
  groomInstagram?: string;
  groomPhotoUrl?: string;

  brideFullName: string;
  brideNickname: string;
  brideParents: string;
  brideInstagram?: string;
  bridePhotoUrl?: string;
}

export interface EventScheduleItem {
  id: string;
  eventName: string; // e.g. "Akad Nikah", "Resepsi Pernikahan"
  date: string;
  timeRange: string;
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
}

export interface EventSectionData extends BaseSectionData {
  events: EventScheduleItem[];
}

export interface StoryTimelineItem {
  id: string;
  year: string;
  title: string;
  story: string;
}

export interface StorySectionData extends BaseSectionData {
  stories: StoryTimelineItem[];
}

export interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
}

export interface GallerySectionData extends BaseSectionData {
  images: GalleryImageItem[];
}

export interface RsvpSectionData extends BaseSectionData {
  description?: string;
  showAttendanceCount?: boolean;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
}

export interface GiftSectionData extends BaseSectionData {
  giftAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  accounts: BankAccountItem[];
}

export interface FooterSectionData extends BaseSectionData {
  closingText: string;
  thankYouNote: string;
}

export type SectionDataMap = {
  hero: HeroSectionData;
  quote: QuoteSectionData;
  couple: CoupleSectionData;
  event: EventSectionData;
  story: StorySectionData;
  gallery: GallerySectionData;
  rsvp: RsvpSectionData;
  gift: GiftSectionData;
  footer: FooterSectionData;
};

export interface SectionNode<TType extends SectionType = SectionType> {
  id: string;
  type: TType;
  variant: string;
  isVisible: boolean;
  data: SectionDataMap[TType];
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
  data: SectionDataMap[TType];
  themeConfig?: ThemeConfig;
  isEditor?: boolean;
}
