'use client';

import { create } from 'zustand';
import type { InvitationData } from '@/services/api/invitations.api';
import type { SectionNode, SectionType, ThemeConfig, SectionDataMap } from '@/modules/invitation-sections/types';

export type EditorTab = 'sections' | 'inspector' | 'theme';
export type ViewportMode = 'mobile' | 'tablet' | 'full';

interface EditorState {
  invitation: InvitationData | null;
  sections: SectionNode[];
  themeConfig: ThemeConfig;
  activeSectionId: string | null;
  activeTab: EditorTab;
  viewportMode: ViewportMode;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;

  // Actions
  initEditor: (invitation: InvitationData) => void;
  setActiveSection: (id: string | null) => void;
  setActiveTab: (tab: EditorTab) => void;
  setViewportMode: (mode: ViewportMode) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  moveSection: (id: string, direction: 'up' | 'down') => void;
  addSection: (type: SectionType, variant?: string) => void;
  updateSectionData: (id: string, patch: Record<string, unknown>) => void;
  updateSectionVariant: (id: string, variant: string) => void;
  toggleSectionVisibility: (id: string) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  setSaving: (saving: boolean) => void;
  setPublishing: (publishing: boolean) => void;
  markSaved: (updatedInvitation: InvitationData) => void;
}

function getDefaultSectionData(type: SectionType, title = 'Wedding Celebration'): SectionDataMap[SectionType] {
  switch (type) {
    case 'hero':
      return {
        title,
        subtitle: 'The Wedding Celebration',
        groomName: 'Romeo',
        brideName: 'Juliet',
        weddingDate: 'Sabtu, 28 Oktober 2026',
        welcomeNote: 'Dengan penuh rasa syukur, kami mengundang Anda untuk hadir dalam momen bahagia pernikahan kami.',
      };
    case 'quote':
      return {
        title: 'Kutipan Suci',
        quoteText: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
        sourceText: 'QS. Ar-Rum: 21',
      };
    case 'couple':
      return {
        title: 'Mempelai Pengantin',
        subtitle: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengumumkan pernikahan putra-putri kami:',
        groomFullName: 'Romeo Montague, S.T.',
        groomNickname: 'Romeo',
        groomParents: 'Putra tercinta Bpk. Montague & Ibu Montague',
        groomInstagram: 'romeomontague',
        brideFullName: 'Juliet Capulet, S.Farm.',
        brideNickname: 'Juliet',
        brideParents: 'Putri tercinta Bpk. Capulet & Ibu Capulet',
        brideInstagram: 'julietcapulet',
      };
    case 'event':
      return {
        title: 'Agenda Acara',
        subtitle: 'Rangkaian momen bahagia pernikahan kami',
        events: [
          {
            id: 'event-1',
            eventName: 'Akad Nikah',
            date: 'Sabtu, 28 Oktober 2026',
            timeRange: '08:00 - 10:00 WIB',
            venueName: 'Masjid Agung Al-Azhar',
            venueAddress: 'Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan',
            mapsUrl: 'https://maps.google.com',
          },
          {
            id: 'event-2',
            eventName: 'Resepsi Pernikahan',
            date: 'Sabtu, 28 Oktober 2026',
            timeRange: '11:00 - 14:00 WIB',
            venueName: 'Grand Ballroom Hotel Mulia',
            venueAddress: 'Jl. Asia Afrika, Senayan, Jakarta Pusat',
            mapsUrl: 'https://maps.google.com',
          },
        ],
      };
    case 'gallery':
      return {
        title: 'Momen Bahagia',
        subtitle: 'Galeri potret kenangan kebersamaan kami',
        images: [
          { id: 'img-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', caption: 'Pre-wedding' },
          { id: 'img-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', caption: 'Romantic Sunset' },
          { id: 'img-3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', caption: 'Engagement' },
          { id: 'img-4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', caption: 'Together' },
        ],
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
        giftAddress: 'Jl. Melati No. 12, Senayan, Jakarta Pusat 10270',
        recipientName: 'Romeo Montague',
        recipientPhone: '08123456789',
        accounts: [
          {
            id: 'acc-1',
            bankName: 'BCA',
            accountNumber: '1234567890',
            accountHolder: 'Romeo Montague',
          },
          {
            id: 'acc-2',
            bankName: 'Mandiri',
            accountNumber: '9876543210',
            accountHolder: 'Juliet Capulet',
          },
        ],
      };
    case 'footer':
      return {
        title: 'Penutup',
        closingText: 'Terima Kasih',
        thankYouNote: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
      };
    case 'story':
      return {
        title: 'Kisah Kami',
        stories: [
          { id: 'st-1', year: '2020', title: 'Pertama Bertemu', story: 'Pertemuan pertama kami di bangku kuliah.' },
          { id: 'st-2', year: '2024', title: 'Lamaran', story: 'Momen sakral saat kami sepakat melangkah ke jenjang pernikahan.' },
        ],
      };
  }
}

export const useInvitationEditorStore = create<EditorState>((set, get) => ({
  invitation: null,
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
  activeTab: 'sections',
  viewportMode: 'mobile',
  isDirty: false,
  isSaving: false,
  isPublishing: false,

  initEditor: (invitation: InvitationData) => {
    // Parse sections and ensure valid defaults
    const rawSections = (Array.isArray(invitation.sections) && invitation.sections.length > 0)
      ? (invitation.sections as unknown as SectionNode[])
      : [
          { id: 'sec-hero', type: 'hero' as SectionType, variant: 'classic', isVisible: true, data: getDefaultSectionData('hero', invitation.title) },
          { id: 'sec-quote', type: 'quote' as SectionType, variant: 'sacred', isVisible: true, data: getDefaultSectionData('quote') },
          { id: 'sec-couple', type: 'couple' as SectionType, variant: 'side-by-side', isVisible: true, data: getDefaultSectionData('couple') },
          { id: 'sec-event', type: 'event' as SectionType, variant: 'cards', isVisible: true, data: getDefaultSectionData('event') },
          { id: 'sec-gallery', type: 'gallery' as SectionType, variant: 'grid', isVisible: true, data: getDefaultSectionData('gallery') },
          { id: 'sec-rsvp', type: 'rsvp' as SectionType, variant: 'interactive', isVisible: true, data: getDefaultSectionData('rsvp') },
          { id: 'sec-gift', type: 'gift' as SectionType, variant: 'bank-cards', isVisible: true, data: getDefaultSectionData('gift') },
          { id: 'sec-footer', type: 'footer' as SectionType, variant: 'closing', isVisible: true, data: getDefaultSectionData('footer') },
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
      sections: rawSections,
      themeConfig: currentTheme,
      activeSectionId: rawSections[0]?.id || null,
      activeTab: 'sections',
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
        data: getDefaultSectionData(type, state.invitation?.title || 'Wedding'),
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

  updateSectionData: (id: string, patch: Record<string, unknown>) => {
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.id === id
          ? { ...sec, data: { ...sec.data, ...patch } as SectionNode['data'] }
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
        data: JSON.parse(JSON.stringify(target.data)),
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
}));
