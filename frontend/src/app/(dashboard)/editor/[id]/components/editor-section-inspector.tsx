'use client';

import * as React from 'react';
import {
  ChevronLeft,
  Sliders,
  Trash2,
  Layout,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Layers,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import type {
  SectionType,
  FrameStyle,
  SectionStyleConfig,
} from '@/modules/invitation-sections/types';

const SECTION_VARIANT_OPTIONS: Partial<
  Record<SectionType, { label: string; value: string; description: string }[]>
> = {
  gallery: [
    { label: 'Grid 2 Kolom', value: 'grid', description: 'Tampilan grid foto rapi' },
    { label: 'Slider Carousel', value: 'slider', description: 'Geser horizontal dengan navigasi' },
    { label: 'Cards Bertingkat', value: 'cards', description: 'Kartu editorial berbingkai' },
  ],
  event: [
    { label: 'Kartu Agenda', value: 'cards', description: 'Kartu terpisah per acara' },
    { label: 'Garis Waktu', value: 'timeline', description: 'Tampilan kronologis waktu' },
  ],
};

const FRAME_STYLE_OPTIONS: { label: string; value: FrameStyle; description: string }[] = [
  { label: 'Polos', value: 'none', description: 'Sesuai warna dasar tema' },
  { label: 'Garis Klasik', value: 'classic-border', description: 'Garis bingkai ganda elegan' },
  { label: 'Sudut Bunga', value: 'floral-corners', description: 'Hiasan ornamen di 4 sudut' },
  { label: 'Kartu Melayang', value: 'card-box', description: 'Kotak kartu dengan bayangan lembut' },
  { label: 'Jendela Kubah', value: 'arch-window', description: 'Lengkungan klasik bagian atas' },
];

export const EditorSectionInspector: React.FC = () => {
  const content = useInvitationEditorStore((s) => s.content);
  const sections = useInvitationEditorStore((s) => s.sections);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const updateSectionCopy = useInvitationEditorStore((s) => s.updateSectionCopy);
  const updateSectionVariant = useInvitationEditorStore((s) => s.updateSectionVariant);
  const updateSectionStyle = useInvitationEditorStore((s) => s.updateSectionStyle);
  const deleteSection = useInvitationEditorStore((s) => s.deleteSection);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  if (!activeSection) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground space-y-3">
        <Sliders className="w-8 h-8 mx-auto opacity-40" />
        <p>Pilih salah satu bagian dari susunan halaman atau klik langsung pada kanvas untuk mengatur gaya.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setActiveTab('sections')}
          className="text-xs"
        >
          Lihat Susunan Bagian
        </Button>
      </div>
    );
  }

  const copy = (activeSection.copy || {}) as Record<string, unknown>;
  const style = (activeSection.style || {}) as SectionStyleConfig;
  const availableVariants = SECTION_VARIANT_OPTIONS[activeSection.type];

  // Shortcut foto dari mempelai & galeri
  const availablePhotos: { label: string; url: string }[] = [];
  if (content.couple?.groom?.photoUrl) {
    availablePhotos.push({ label: 'Foto Pria', url: content.couple.groom.photoUrl });
  }
  if (content.couple?.bride?.photoUrl) {
    availablePhotos.push({ label: 'Foto Wanita', url: content.couple.bride.photoUrl });
  }
  if (Array.isArray(content.gallery)) {
    content.gallery.forEach((p, idx) => {
      if (p?.url) {
        availablePhotos.push({ label: `Galeri #${idx + 1}`, url: p.url });
      }
    });
  }

  const handleCopyChange = (field: string, value: string) => {
    updateSectionCopy(activeSection.id, { [field]: value });
  };

  return (
    <div className="space-y-5 text-xs" data-testid="editor-section-inspector">
      {/* Header Inspector */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Susunan</span>
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

      {/* Info Banner: Data Single Source of Truth */}
      <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5">
        <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground text-[11px]">
            Data Inti Dikelola di Tab &ldquo;Isi Data&rdquo;
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Nama mempelai, jadwal acara, foto, dan nomor rekening terhubung secara otomatis di seluruh bagian.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-0.5"
          >
            <span>Buka Form Isi Data</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Pilihan Varian Tata Letak jika tersedia */}
      {availableVariants && availableVariants.length > 0 && (
        <div className="space-y-2">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-primary" />
            <span>Pilihan Varian Tampilan</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {availableVariants.map((opt) => {
              const isSelected = (activeSection.variant || 'default') === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  data-testid={`inspector-variant-${opt.value}`}
                  onClick={() => updateSectionVariant(activeSection.id, opt.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary bg-primary/5 font-medium text-foreground'
                      : 'border-border bg-card/60 hover:border-primary/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{opt.label}</span>
                    {isSelected && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Kustomisasi Latar Belakang & Bingkai Bagian */}
      <div className="space-y-4 pt-3 border-t border-border" data-testid="inspector-style-section">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Latar Belakang & Bingkai</span>
          </label>
          {(style.backgroundImageUrl || (style.frameStyle && style.frameStyle !== 'none')) && (
            <button
              type="button"
              onClick={() =>
                updateSectionStyle(activeSection.id, {
                  backgroundImageUrl: undefined,
                  frameStyle: 'none',
                })
              }
              className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset Gaya</span>
            </button>
          )}
        </div>

        {/* 1. Pilihan Gaya Bingkai / Ornamen */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground block">
            Gaya Bingkai & Ornamen
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {FRAME_STYLE_OPTIONS.map((frameOpt) => {
              const isSelected = (style.frameStyle || 'none') === frameOpt.value;
              return (
                <button
                  key={frameOpt.value}
                  type="button"
                  data-testid={`inspector-frame-${frameOpt.value}`}
                  onClick={() =>
                    updateSectionStyle(activeSection.id, { frameStyle: frameOpt.value })
                  }
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary bg-primary/10 text-foreground font-semibold'
                      : 'border-border bg-card/60 hover:border-primary/40 text-muted-foreground'
                  }`}
                >
                  <p className="text-[11px] font-medium">{frameOpt.label}</p>
                  <p className="text-[9px] text-muted-caption truncate">{frameOpt.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pilihan Foto Latar Bagian */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-medium text-muted-foreground block">
            Foto Latar Bagian (Backdrop)
          </span>

          {/* Quick-Pick Chips from Groom / Bride / Gallery */}
          {availablePhotos.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-muted-caption">Pilih Cepat dari Data Mempelai:</span>
              <div className="flex flex-wrap gap-1.5">
                {availablePhotos.map((photo, pIdx) => {
                  const isCurrent = style.backgroundImageUrl === photo.url;
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() =>
                        updateSectionStyle(activeSection.id, { backgroundImageUrl: photo.url })
                      }
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] border transition-all ${
                        isCurrent
                          ? 'border-primary bg-primary text-white font-semibold'
                          : 'border-border bg-card hover:border-primary/50 text-foreground'
                      }`}
                    >
                      <ImageIcon className="w-2.5 h-2.5" />
                      <span>{photo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Manual URL Input */}
          <div className="relative">
            <input
              type="text"
              value={style.backgroundImageUrl || ''}
              onChange={(e) =>
                updateSectionStyle(activeSection.id, {
                  backgroundImageUrl: e.target.value.trim() || undefined,
                })
              }
              placeholder="Atau tempel URL foto (https://...)"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-ring pr-7"
            />
            {style.backgroundImageUrl && (
              <button
                type="button"
                onClick={() =>
                  updateSectionStyle(activeSection.id, { backgroundImageUrl: undefined })
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Slider Kegelapan Overlay (hanya jika ada foto latar) */}
        {style.backgroundImageUrl && (
          <div className="p-2.5 rounded-xl border border-border/80 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-primary" />
                <span>Kegelapan Lapisan Foto (Overlay)</span>
              </span>
              <span className="font-mono font-semibold text-primary">
                {style.backgroundOverlayOpacity ?? 40}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={style.backgroundOverlayOpacity ?? 40}
              onChange={(e) =>
                updateSectionStyle(activeSection.id, {
                  backgroundOverlayOpacity: Number(e.target.value),
                })
              }
              className="w-full accent-primary cursor-pointer h-1.5 bg-border rounded-lg"
            />
            <p className="text-[10px] text-muted-caption leading-tight">
              Tingkatkan kegelapan agar tulisan undangan di atas foto tetap kontras dan nyaman dibaca.
            </p>
          </div>
        )}
      </div>

      {/* Kustomisasi Teks Kontekstual Bagian (Copy) */}
      <div className="space-y-3 pt-2 border-t border-border">
        <label className="font-semibold text-foreground block">
          Penyesuaian Judul & Pesan Bagian
        </label>

        {activeSection.type !== 'hero' && (
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Judul Seksi
            </label>
            <input
              type="text"
              value={(copy.title as string) || ''}
              onChange={(e) => handleCopyChange('title', e.target.value)}
              placeholder="Judul Bagian"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
            Subjudul / Keterangan Pembuka
          </label>
          <input
            type="text"
            value={(copy.subtitle as string) || ''}
            onChange={(e) => handleCopyChange('subtitle', e.target.value)}
            placeholder="Subjudul Bagian"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {activeSection.type === 'hero' && (
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Pesan Sambutan (Welcome Note)
            </label>
            <textarea
              rows={3}
              value={(copy.welcomeNote as string) || ''}
              onChange={(e) => handleCopyChange('welcomeNote', e.target.value)}
              placeholder="Dengan penuh rasa syukur..."
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        )}

        {activeSection.type === 'footer' && (
          <>
            <div>
              <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                Teks Penutup
              </label>
              <input
                type="text"
                value={(copy.closingText as string) || ''}
                onChange={(e) => handleCopyChange('closingText', e.target.value)}
                placeholder="Terima Kasih"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
                Catatan Terima Kasih
              </label>
              <textarea
                rows={3}
                value={(copy.thankYouNote as string) || ''}
                onChange={(e) => handleCopyChange('thankYouNote', e.target.value)}
                placeholder="Merupakan suatu kehormatan..."
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
