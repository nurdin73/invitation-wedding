'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  isComplete: boolean;
  isRequired: boolean;
}

export function useContentCompleteness() {
  const content = useInvitationEditorStore((s) => s.content);

  return React.useMemo(() => {
    const groomNick = content.couple.groom.nickname.trim();
    const brideNick = content.couple.bride.nickname.trim();
    const hasCouple = Boolean(groomNick && brideNick);

    const hasEvents = content.events.some((ev) => Boolean(ev.eventName.trim() && ev.date.trim()));
    const hasQuote = Boolean(content.quote.quoteText.trim());
    const hasGallery = content.gallery.length > 0;
    const hasGift = content.gift.accounts.length > 0 || Boolean(content.gift.giftAddress?.trim());
    const hasMusic = Boolean(content.music.audioUrl?.trim());

    const items: ChecklistItem[] = [
      {
        id: 'couple',
        label: 'Profil Mempelai',
        description: 'Nama panggilan kedua mempelai wajib diisi',
        isComplete: hasCouple,
        isRequired: true,
      },
      {
        id: 'events',
        label: 'Jadwal Acara',
        description: 'Setidaknya 1 agenda acara dengan tanggal pasti',
        isComplete: hasEvents,
        isRequired: true,
      },
      {
        id: 'quote',
        label: 'Kutipan / Ayat Suci',
        description: 'Pesan puitis atau ayat pembuka undangan',
        isComplete: hasQuote,
        isRequired: false,
      },
      {
        id: 'gallery',
        label: 'Galeri Foto',
        description: 'Foto kenangan pre-wedding atau kebersamaan',
        isComplete: hasGallery,
        isRequired: false,
      },
      {
        id: 'gift',
        label: 'Tanda Kasih & Rekening',
        description: 'Nomor rekening atau alamat pengiriman kado',
        isComplete: hasGift,
        isRequired: false,
      },
      {
        id: 'music',
        label: 'Musik Latar',
        description: 'Audio pengiring suasana pernikahan',
        isComplete: hasMusic,
        isRequired: false,
      },
    ];

    const requiredItems = items.filter((i) => i.isRequired);
    const isReadyToPublish = requiredItems.every((i) => i.isComplete);
    const completedCount = items.filter((i) => i.isComplete).length;
    const percentage = Math.round((completedCount / items.length) * 100);

    return {
      items,
      isReadyToPublish,
      percentage,
      completedCount,
      totalCount: items.length,
    };
  }, [content]);
}
