export interface PersonProfile {
  fullName: string;
  nickname: string;
  parents: string;
  instagram?: string;
  photoUrl?: string;
}

export interface EventItem {
  id: string;
  eventName: string;
  date: string;
  timeRange: string;
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
}

export interface StoryItem {
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
  story: StoryItem[];
  gallery: GalleryImageItem[];
  gift: GiftConfig;
  music: MusicConfig;
}

export function createDefaultInvitationContent(
  _title = 'Pernikahan Kami',
  groomNickname = '',
  brideNickname = ''
): InvitationContent {
  return {
    couple: {
      groom: {
        fullName: '',
        nickname: groomNickname,
        parents: '',
        instagram: '',
        photoUrl: '',
      },
      bride: {
        fullName: '',
        nickname: brideNickname,
        parents: '',
        instagram: '',
        photoUrl: '',
      },
    },
    events: [
      {
        id: 'event-akad',
        eventName: 'Akad Nikah',
        date: '',
        timeRange: '08:00 - 10:00 WIB',
        venueName: '',
        venueAddress: '',
        mapsUrl: '',
      },
      {
        id: 'event-resepsi',
        eventName: 'Resepsi Pernikahan',
        date: '',
        timeRange: '11:00 - 13:00 WIB',
        venueName: '',
        venueAddress: '',
        mapsUrl: '',
      },
    ],
    quote: {
      quoteText:
        'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
      sourceText: 'QS. Ar-Rum: 21',
    },
    story: [],
    gallery: [],
    gift: {
      accounts: [],
      giftAddress: '',
      recipientName: '',
      recipientPhone: '',
    },
    music: {
      audioUrl: '',
      isAutoplay: false,
    },
  };
}

export interface SectionNodeData {
  id: string;
  type: string;
  variant: string;
  isVisible: boolean;
  copy?: Record<string, unknown>;
}

export function mergeTemplateLayout(
  existingSections: unknown[],
  newTemplateSections: unknown[]
): SectionNodeData[] {
  const existingMap = new Map<string, SectionNodeData>();

  if (Array.isArray(existingSections)) {
    for (const item of existingSections) {
      if (typeof item === 'object' && item !== null && 'type' in item) {
        const sec = item as SectionNodeData;
        existingMap.set(sec.type, sec);
      }
    }
  }

  const rawTemplateSections = (Array.isArray(newTemplateSections)
    ? newTemplateSections
    : []) as SectionNodeData[];

  return rawTemplateSections.map((tplSec, index) => {
    const existing = existingMap.get(tplSec.type);
    return {
      id: tplSec.id || `sec-${tplSec.type}-${index + 1}`,
      type: tplSec.type,
      variant: tplSec.variant || 'default',
      isVisible: existing ? existing.isVisible : tplSec.isVisible !== false,
      copy: {
        ...(tplSec.copy || {}),
        ...(existing?.copy || {}),
      },
    };
  });
}
