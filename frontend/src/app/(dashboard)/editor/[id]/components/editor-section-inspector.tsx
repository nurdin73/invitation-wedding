'use client';

import * as React from 'react';
import { ChevronLeft, Sliders, Trash2, Layout, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import type { SectionType } from '@/modules/invitation-sections/types';

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

export const EditorSectionInspector: React.FC = () => {
  const sections = useInvitationEditorStore((s) => s.sections);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const updateSectionCopy = useInvitationEditorStore((s) => s.updateSectionCopy);
  const updateSectionVariant = useInvitationEditorStore((s) => s.updateSectionVariant);
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
  const availableVariants = SECTION_VARIANT_OPTIONS[activeSection.type];

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
