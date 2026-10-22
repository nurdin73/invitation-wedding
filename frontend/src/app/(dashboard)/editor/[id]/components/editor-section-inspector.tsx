'use client';

import * as React from 'react';
import { ChevronLeft, Sliders, Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import type {
  HeroSectionData,
  QuoteSectionData,
  CoupleSectionData,
  EventSectionData,
  GiftSectionData,
  FooterSectionData,
} from '@/modules/invitation-sections/types';

export const EditorSectionInspector: React.FC = () => {
  const sections = useInvitationEditorStore((s) => s.sections);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const updateSectionData = useInvitationEditorStore((s) => s.updateSectionData);
  const deleteSection = useInvitationEditorStore((s) => s.deleteSection);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  if (!activeSection) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground space-y-3">
        <Sliders className="w-8 h-8 mx-auto opacity-40" />
        <p>Pilih salah satu bagian dari daftar seksi atau langsung klik pada kanvas untuk mengedit konten.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('sections')}
          className="text-xs"
        >
          Lihat Daftar Bagian
        </Button>
      </div>
    );
  }

  const handleTextChange = (field: string, value: unknown) => {
    updateSectionData(activeSection.id, { [field]: value });
  };

  return (
    <div className="space-y-5" data-testid="editor-section-inspector">
      {/* Header Inspector */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Struktur</span>
        </button>

        <button
          type="button"
          onClick={() => deleteSection(activeSection.id)}
          className="p-1 text-muted-foreground hover:text-destructive transition-colors text-xs inline-flex items-center gap-1"
          title="Hapus Bagian Ini"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase font-mono">
          <Type className="w-3.5 h-3.5" />
          <span>Bagian: {activeSection.type}</span>
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          Pengaturan Konten & Teks
        </h4>
      </div>

      {/* Dynamic Form per Section Type */}
      <div className="space-y-4 text-xs">
        {/* Title & Subtitle Universal Fields */}
        <div>
          <label className="block font-medium mb-1 text-foreground">Judul Bagian</label>
          <input
            type="text"
            value={(activeSection.data?.title as string) || ''}
            onChange={(e) => handleTextChange('title', e.target.value)}
            placeholder="Judul Section"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Hero Specific */}
        {activeSection.type === 'hero' && (() => {
          const hero = activeSection.data as HeroSectionData;
          return (
            <>
              <div>
                <label className="block font-medium mb-1 text-foreground">Nama Mempelai Pria</label>
                <input
                  type="text"
                  value={hero.groomName || ''}
                  onChange={(e) => handleTextChange('groomName', e.target.value)}
                  placeholder="Romeo"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Nama Mempelai Wanita</label>
                <input
                  type="text"
                  value={hero.brideName || ''}
                  onChange={(e) => handleTextChange('brideName', e.target.value)}
                  placeholder="Juliet"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Tanggal Acara</label>
                <input
                  type="text"
                  value={hero.weddingDate || ''}
                  onChange={(e) => handleTextChange('weddingDate', e.target.value)}
                  placeholder="Sabtu, 28 Oktober 2026"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Pesan Pembuka</label>
                <textarea
                  rows={3}
                  value={hero.welcomeNote || ''}
                  onChange={(e) => handleTextChange('welcomeNote', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
            </>
          );
        })()}

        {/* Quote Specific */}
        {activeSection.type === 'quote' && (() => {
          const q = activeSection.data as QuoteSectionData;
          return (
            <>
              <div>
                <label className="block font-medium mb-1 text-foreground">Teks Ayat / Kutipan</label>
                <textarea
                  rows={4}
                  value={q.quoteText || ''}
                  onChange={(e) => handleTextChange('quoteText', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Sumber Kutipan (cth: QS. Ar-Rum: 21)</label>
                <input
                  type="text"
                  value={q.sourceText || ''}
                  onChange={(e) => handleTextChange('sourceText', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </>
          );
        })()}

        {/* Couple Specific */}
        {activeSection.type === 'couple' && (() => {
          const couple = activeSection.data as CoupleSectionData;
          return (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-border bg-card-oat/40 space-y-2">
                <p className="font-semibold text-primary">Data Mempelai Pria</p>
                <div>
                  <label className="block text-[11px] mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={couple.groomFullName || ''}
                    onChange={(e) => handleTextChange('groomFullName', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={couple.groomParents || ''}
                    onChange={(e) => handleTextChange('groomParents', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1">Username Instagram</label>
                  <input
                    type="text"
                    value={couple.groomInstagram || ''}
                    onChange={(e) => handleTextChange('groomInstagram', e.target.value)}
                    placeholder="romeomontague"
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card-oat/40 space-y-2">
                <p className="font-semibold text-primary">Data Mempelai Wanita</p>
                <div>
                  <label className="block text-[11px] mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={couple.brideFullName || ''}
                    onChange={(e) => handleTextChange('brideFullName', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={couple.brideParents || ''}
                    onChange={(e) => handleTextChange('brideParents', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-1">Username Instagram</label>
                  <input
                    type="text"
                    value={couple.brideInstagram || ''}
                    onChange={(e) => handleTextChange('brideInstagram', e.target.value)}
                    placeholder="julietcapulet"
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Story / Love Story Specific */}
        {activeSection.type === 'story' && (() => {
          const st = activeSection.data as { stories?: Array<{ id: string; year: string; title: string; story: string }> };
          const stories = st.stories || [];
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Daftar Momen Cerita</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...stories,
                      {
                        id: `st-${Date.now()}`,
                        year: '2026',
                        title: 'Momen Baru',
                        story: 'Ceritakan kisah indah perjalanan cinta Anda...',
                      },
                    ];
                    handleTextChange('stories', next);
                  }}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  + Tambah Momen
                </button>
              </div>

              {stories.map((item, idx) => (
                <div key={item.id || idx} className="p-3 rounded-lg border border-border space-y-2 bg-card-oat/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase text-primary">Momen #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = stories.filter((_, i) => i !== idx);
                        handleTextChange('stories', next);
                      }}
                      className="text-[10px] text-muted-foreground hover:text-destructive"
                    >
                      Hapus
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Tahun</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const next = [...stories];
                        next[idx] = { ...next[idx], year: e.target.value };
                        handleTextChange('stories', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Judul Momen</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...stories];
                        next[idx] = { ...next[idx], title: e.target.value };
                        handleTextChange('stories', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Kisah Singkat</label>
                    <textarea
                      rows={2}
                      value={item.story}
                      onChange={(e) => {
                        const next = [...stories];
                        next[idx] = { ...next[idx], story: e.target.value };
                        handleTextChange('stories', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        {activeSection.type === 'event' && (() => {
          const ev = activeSection.data as EventSectionData;
          return (
            <div className="space-y-3">
              <p className="text-muted-foreground text-[11px]">
                Agenda acara seperti Akad dan Resepsi dapat dikonfigurasi melalui data jadwal berikut:
              </p>
              {ev.events?.map((item, idx) => (
                <div key={item.id || idx} className="p-3 rounded-lg border border-border space-y-2 bg-card-oat/20">
                  <div className="font-semibold text-foreground">{item.eventName}</div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Waktu & Tanggal</label>
                    <input
                      type="text"
                      value={item.timeRange}
                      onChange={(e) => {
                        const next = [...(ev.events || [])];
                        next[idx] = { ...next[idx], timeRange: e.target.value };
                        handleTextChange('events', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground">Tempat / Lokasi</label>
                    <input
                      type="text"
                      value={item.venueName}
                      onChange={(e) => {
                        const next = [...(ev.events || [])];
                        next[idx] = { ...next[idx], venueName: e.target.value };
                        handleTextChange('events', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background"
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Gift Specific */}
        {activeSection.type === 'gift' && (() => {
          const gift = activeSection.data as GiftSectionData;
          return (
            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1 text-foreground">Alamat Kirim Kado Fisik</label>
                <textarea
                  rows={2}
                  value={gift.giftAddress || ''}
                  onChange={(e) => handleTextChange('giftAddress', e.target.value)}
                  placeholder="Alamat lengkap penerima..."
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Rekening Transfer</p>
                {gift.accounts?.map((acc, idx) => (
                  <div key={acc.id || idx} className="p-2.5 rounded-lg border border-border bg-card-oat/30 space-y-1.5">
                    <input
                      type="text"
                      value={acc.bankName}
                      placeholder="Nama Bank (BCA / Mandiri)"
                      onChange={(e) => {
                        const next = [...(gift.accounts || [])];
                        next[idx] = { ...next[idx], bankName: e.target.value };
                        handleTextChange('accounts', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background"
                    />
                    <input
                      type="text"
                      value={acc.accountNumber}
                      placeholder="Nomor Rekening"
                      onChange={(e) => {
                        const next = [...(gift.accounts || [])];
                        next[idx] = { ...next[idx], accountNumber: e.target.value };
                        handleTextChange('accounts', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background font-mono"
                    />
                    <input
                      type="text"
                      value={acc.accountHolder}
                      placeholder="Atas Nama (Pemilik Rekening)"
                      onChange={(e) => {
                        const next = [...(gift.accounts || [])];
                        next[idx] = { ...next[idx], accountHolder: e.target.value };
                        handleTextChange('accounts', next);
                      }}
                      className="w-full rounded border px-2 py-1 text-xs bg-background"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Footer Specific */}
        {activeSection.type === 'footer' && (() => {
          const ft = activeSection.data as FooterSectionData;
          return (
            <>
              <div>
                <label className="block font-medium mb-1 text-foreground">Teks Penutup</label>
                <input
                  type="text"
                  value={ft.closingText || ''}
                  onChange={(e) => handleTextChange('closingText', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-foreground">Ucapan Terima Kasih</label>
                <textarea
                  rows={3}
                  value={ft.thankYouNote || ''}
                  onChange={(e) => handleTextChange('thankYouNote', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs resize-none"
                />
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};
