'use client';

import { create } from 'zustand';
import type { InvitationData } from '@/services/api/invitations.api';
import type { SubscriptionInfo } from '@/services/api/billing.api';
import type {
  SectionNode,
  SectionType,
  ThemeConfig,
  InvitationContent,
  SectionCopyMap,
  SectionStyleConfig,
} from '@/modules/invitation-sections/types';

export type EditorTab = 'content' | 'design' | 'sections' | 'inspector';
export type ViewportMode = 'mobile' | 'tablet' | 'laptop' | 'full';

interface EditorState {
  invitation: InvitationData | null;
  content: InvitationContent;
  sections: SectionNode[];
  themeConfig: ThemeConfig;
  activeSectionId: string | null;
  activeTab: EditorTab;
  viewportMode: ViewportMode;
  isLeftPanelCollapsed: boolean;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;

  // Actions
  initEditor: (invitation: InvitationData) => void;
  setActiveSection: (id: string | null) => void;
  setActiveTab: (tab: EditorTab) => void;
  setViewportMode: (mode: ViewportMode) => void;
  toggleLeftPanel: () => void;
  setLeftPanelCollapsed: (collapsed: boolean) => void;

  // Content actions
  updateContent: (patch: Partial<InvitationContent>) => void;
  updateCouple: (patch: Partial<InvitationContent['couple']>) => void;
  updateEvents: (events: InvitationContent['events']) => void;
  updateQuote: (quote: InvitationContent['quote']) => void;
  updateStory: (story: InvitationContent['story']) => void;
  updateGallery: (gallery: InvitationContent['gallery']) => void;
  updateGift: (gift: InvitationContent['gift']) => void;
  updateMusic: (music: InvitationContent['music']) => void;

  // Section layout actions
  reorderSections: (fromIndex: number, toIndex: number) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  addSection: (type: SectionType, variant?: string) => void;
  updateSectionCopy: (id: string, copyPatch: Record<string, unknown>) => void;
  updateSectionVariant: (id: string, variant: string) => void;
  updateSectionStyle: (id: string, stylePatch: Partial<SectionStyleConfig>) => void;
  toggleSectionVisibility: (id: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;

  // Theme & Template actions
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  applyTemplateLocally: (themeConfig: ThemeConfig, newSections: SectionNode[]) => void;

  // Save & publish meta
  setSaving: (saving: boolean) => void;
  setPublishing: (publishing: boolean) => void;
  markSaved: (updatedInvitation: InvitationData) => void;

  // Subscription & Pro status
  subscription: SubscriptionInfo | null;
  isPro: boolean;
  isUpgradeModalOpen: boolean;
  setSubscription: (sub: SubscriptionInfo | null) => void;
  setUpgradeModalOpen: (open: boolean) => void;
}

function getDefaultSectionCopy(type: SectionType): SectionCopyMap[SectionType] {
  switch (type) {
    case 'hero':
      return {
        subtitle: 'The Wedding Celebration',
        welcomeNote:
          'Dengan penuh rasa syukur dan sukacita, kami mengundang Anda untuk hadir dalam momen bahagia pernikahan kami.',
      };
    case 'quote':
      return {
        title: 'Kutipan Suci',
      };
    case 'couple':
      return {
        title: 'Mempelai Pengantin',
        subtitle:
          'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengumumkan pernikahan putra-putri kami:',
      };
    case 'event':
      return {
        title: 'Agenda Acara',
        subtitle: 'Rangkaian momen bahagia pernikahan kami',
      };
    case 'gallery':
      return {
        title: 'Momen Bahagia',
        subtitle: 'Galeri potret kenangan kebersamaan kami',
      };
    case 'rsvp':
      return {
        title: 'Konfirmasi Kehadiran & Doa Restu',
        subtitle: 'Kirimkan ucapan dan konfirmasi kehadiran Anda untuk menyempurnakan hari bahagia kami',
        showAttendanceCount: true,
      };
    case 'gift':
      return {
        title: 'Tanda Kasih (Wedding Gift)',
        subtitle: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih, dapat disalurkan melalui rekening berikut:',
      };
    case 'footer':
      return {
        closingText: 'Terima Kasih',
        thankYouNote:
          'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
      };
    case 'story':
      return {
        title: 'Kisah Kami',
        subtitle: 'Perjalanan cinta kami menuju hari bahagia',
      };
  }
}

function createDefaultContent(): InvitationContent {
  return {
    couple: {
      groom: { fullName: '', nickname: '', parents: '', instagram: '', photoUrl: '' },
      bride: { fullName: '', nickname: '', parents: '', instagram: '', photoUrl: '' },
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

export const useInvitationEditorStore = create<EditorState>((set, get) => ({
  invitation: null,
  content: createDefaultContent(),
  sections: [],
  themeConfig: {
    paletteId: 'dusty-rose',
    primaryColor: '#B86B70',
    secondaryColor: '#DFB15B',
    canvasBackground: '#FAF8F5',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Plus Jakarta Sans, sans-serif',
  },
  activeSectionId: null,
  activeTab: 'content',
  viewportMode: 'mobile',
  isLeftPanelCollapsed: false,
  isDirty: false,
  isSaving: false,
  isPublishing: false,
  subscription: null,
  isPro: false,
  isUpgradeModalOpen: false,

  initEditor: (invitation: InvitationData) => {
    // 1. Ekstrak canonical content
    const rawContent = (invitation.content && typeof invitation.content === 'object' && Object.keys(invitation.content).length > 0)
      ? (invitation.content as unknown as InvitationContent)
      : createDefaultContent();

    // 2. Ekstrak layout sections
    const rawSections = (Array.isArray(invitation.sections) && invitation.sections.length > 0)
      ? (invitation.sections as unknown as SectionNode[])
      : [
          { id: 'sec-hero-1', type: 'hero' as SectionType, variant: 'classic', isVisible: true, copy: getDefaultSectionCopy('hero') },
          { id: 'sec-quote-1', type: 'quote' as SectionType, variant: 'sacred', isVisible: true, copy: getDefaultSectionCopy('quote') },
          { id: 'sec-couple-1', type: 'couple' as SectionType, variant: 'side-by-side', isVisible: true, copy: getDefaultSectionCopy('couple') },
          { id: 'sec-event-1', type: 'event' as SectionType, variant: 'cards', isVisible: true, copy: getDefaultSectionCopy('event') },
          { id: 'sec-gallery-1', type: 'gallery' as SectionType, variant: 'grid', isVisible: true, copy: getDefaultSectionCopy('gallery') },
          { id: 'sec-rsvp-1', type: 'rsvp' as SectionType, variant: 'interactive', isVisible: true, copy: getDefaultSectionCopy('rsvp') },
          { id: 'sec-gift-1', type: 'gift' as SectionType, variant: 'bank-cards', isVisible: true, copy: getDefaultSectionCopy('gift') },
          { id: 'sec-footer-1', type: 'footer' as SectionType, variant: 'closing', isVisible: true, copy: getDefaultSectionCopy('footer') },
        ];

    const currentTheme: ThemeConfig = {
      paletteId: 'dusty-rose',
      primaryColor: '#B86B70',
      secondaryColor: '#DFB15B',
      canvasBackground: '#FAF8F5',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
      ...(invitation.themeConfig as ThemeConfig),
    };

    set({
      invitation,
      content: rawContent,
      sections: rawSections,
      themeConfig: currentTheme,
      activeSectionId: rawSections[0]?.id || null,
      activeTab: 'content',
      isDirty: false,
      isSaving: false,
      isPublishing: false,
    });
  },

  setActiveSection: (id: string | null) => {
    set((state) => ({
      activeSectionId: id,
      activeTab: id ? 'inspector' : state.activeTab,
    }));
  },

  setActiveTab: (activeTab: EditorTab) => {
    set({ activeTab });
  },

  setViewportMode: (viewportMode: ViewportMode) => {
    set({ viewportMode });
  },

  toggleLeftPanel: () => {
    set((state) => ({ isLeftPanelCollapsed: !state.isLeftPanelCollapsed }));
  },

  setLeftPanelCollapsed: (isLeftPanelCollapsed: boolean) => {
    set({ isLeftPanelCollapsed });
  },

  // Content Handlers
  updateContent: (patch: Partial<InvitationContent>) => {
    set((state) => ({
      content: { ...state.content, ...patch },
      isDirty: true,
    }));
  },

  updateCouple: (patch: Partial<InvitationContent['couple']>) => {
    set((state) => ({
      content: {
        ...state.content,
        couple: { ...state.content.couple, ...patch },
      },
      isDirty: true,
    }));
  },

  updateEvents: (events: InvitationContent['events']) => {
    set((state) => ({
      content: { ...state.content, events },
      isDirty: true,
    }));
  },

  updateQuote: (quote: InvitationContent['quote']) => {
    set((state) => ({
      content: { ...state.content, quote },
      isDirty: true,
    }));
  },

  updateStory: (story: InvitationContent['story']) => {
    set((state) => ({
      content: { ...state.content, story },
      isDirty: true,
    }));
  },

  updateGallery: (gallery: InvitationContent['gallery']) => {
    set((state) => ({
      content: { ...state.content, gallery },
      isDirty: true,
    }));
  },

  updateGift: (gift: InvitationContent['gift']) => {
    set((state) => ({
      content: { ...state.content, gift },
      isDirty: true,
    }));
  },

  updateMusic: (music: InvitationContent['music']) => {
    set((state) => ({
      content: { ...state.content, music },
      themeConfig: {
        ...state.themeConfig,
        audioUrl: music.audioUrl,
        isAutoplayMusic: music.isAutoplay,
      },
      isDirty: true,
    }));
  },

  // Section Layout Handlers
  reorderSections: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const next = [...state.sections];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { sections: next, isDirty: true };
    });
  },

  moveSection: (id: string, direction: 'up' | 'down') => {
    const { sections, reorderSections } = get();
    const index = sections.findIndex((s) => s.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      reorderSections(index, index - 1);
    } else if (direction === 'down' && index < sections.length - 1) {
      reorderSections(index, index + 1);
    }
  },

  addSection: (type: SectionType, variant = 'default') => {
    set((state) => {
      const newId = `sec-${type}-${Date.now().toString(36)}`;
      const newSection: SectionNode = {
        id: newId,
        type,
        variant,
        isVisible: true,
        copy: getDefaultSectionCopy(type),
      };

      const nextSections = [...state.sections, newSection];
      return {
        sections: nextSections,
        activeSectionId: newId,
        activeTab: 'inspector',
        isDirty: true,
      };
    });
  },

  updateSectionCopy: (id: string, copyPatch: Record<string, unknown>) => {
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === id
          ? { ...sec, copy: { ...(sec.copy || {}), ...copyPatch } as SectionNode['copy'] }
          : sec
      ),
      isDirty: true,
    }));
  },

  updateSectionVariant: (id: string, variant: string) => {
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === id ? { ...sec, variant } : sec
      ),
      isDirty: true,
    }));
  },

  updateSectionStyle: (id: string, stylePatch: Partial<SectionStyleConfig>) => {
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === id
          ? { ...sec, style: { ...(sec.style || {}), ...stylePatch } }
          : sec
      ),
      isDirty: true,
    }));
  },

  toggleSectionVisibility: (id: string) => {
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
      isDirty: true,
    }));
  },

  duplicateSection: (id: string) => {
    set((state) => {
      const index = state.sections.findIndex((s) => s.id === id);
      if (index === -1) return state;

      const target = state.sections[index];
      const duplicated: SectionNode = {
        ...target,
        id: `sec-${target.type}-${Date.now().toString(36)}`,
        copy: JSON.parse(JSON.stringify(target.copy || {})),
      };

      const next = [...state.sections];
      next.splice(index + 1, 0, duplicated);

      return {
        sections: next,
        activeSectionId: duplicated.id,
        activeTab: 'inspector',
        isDirty: true,
      };
    });
  },

  deleteSection: (id: string) => {
    set((state) => {
      const next = state.sections.filter((s) => s.id !== id);
      const nextActiveId = state.activeSectionId === id ? (next[0]?.id || null) : state.activeSectionId;
      return {
        sections: next,
        activeSectionId: nextActiveId,
        isDirty: true,
      };
    });
  },

  updateThemeConfig: (config: Partial<ThemeConfig>) => {
    set((state) => ({
      themeConfig: { ...state.themeConfig, ...config },
      isDirty: true,
    }));
  },

  applyTemplateLocally: (themeConfig: ThemeConfig, newSections: SectionNode[]) => {
    set({
      themeConfig,
      sections: newSections,
      isDirty: true,
    });
  },

  setSaving: (isSaving: boolean) => {
    set({ isSaving });
  },

  setPublishing: (isPublishing: boolean) => {
    set({ isPublishing });
  },

  markSaved: (updatedInvitation: InvitationData) => {
    set({
      invitation: updatedInvitation,
      isDirty: false,
      isSaving: false,
    });
  },

  setSubscription: (sub: SubscriptionInfo | null) => {
    set({
      subscription: sub,
      isPro: sub?.isSubscriberActive ?? false,
    });
  },

  setUpgradeModalOpen: (isUpgradeModalOpen: boolean) => {
    set({ isUpgradeModalOpen });
  },
}));
