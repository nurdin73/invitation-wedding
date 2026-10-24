'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { templatesApi, type TemplateData } from '@/services/api/templates.api';
import { invitationsApi } from '@/services/api/invitations.api';
import { LayoutTemplate, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { toast } from 'sonner';
import type { SectionNode, ThemeConfig } from '@/modules/invitation-sections/types';

export const TemplatePicker: React.FC = () => {
  const invitation = useInvitationEditorStore((s) => s.invitation);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const applyTemplateLocally = useInvitationEditorStore((s) => s.applyTemplateLocally);

  const [templates, setTemplates] = React.useState<TemplateData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isApplying, setIsApplying] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    templatesApi
      .getAll()
      .then((res) => {
        if (isMounted && res.data) {
          setTemplates(res.data);
        }
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat template desain.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTemplate = (tpl: TemplateData) => {
    setSelectedTemplate(tpl);
    setIsConfirmOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!invitation || !selectedTemplate) return;

    setIsApplying(true);
    try {
      const res = await invitationsApi.applyTemplate(invitation.id, selectedTemplate.id);
      if (res.data) {
        applyTemplateLocally(
          res.data.themeConfig as ThemeConfig,
          res.data.sections as SectionNode[]
        );
        toast.success(
          `Template "${selectedTemplate.name}" berhasil diterapkan! Data mempelai dan acara Anda tetap aman.`
        );
        setIsConfirmOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menerapkan template.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-4 text-xs" data-testid="editor-design-template-picker">
      <div className="flex items-center gap-2 pb-1 border-b border-border">
        <LayoutTemplate className="w-4 h-4 text-primary" />
        <div>
          <h4 className="font-semibold text-foreground">Ganti Template Desain</h4>
          <p className="text-[10px] text-muted-foreground">
            Beralih desain kapan saja tanpa khawatir kehilangan data pengantin & acara.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground animate-pulse">
          Memuat template desain...
        </div>
      ) : (
        <div className="space-y-2.5">
          {templates.map((tpl) => {
            const isCurrentPalette = themeConfig?.paletteId === tpl.themeConfig?.paletteId;
            const primaryColor = (tpl.themeConfig?.primaryColor as string) || '#B86B70';
            const canvasBg = (tpl.themeConfig?.canvasBackground as string) || '#FAF8F5';

            return (
              <div
                key={tpl.id}
                data-testid={`template-card-${tpl.slug}`}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isCurrentPalette
                    ? 'border-primary ring-1 ring-primary/50 bg-primary/5 shadow-xs'
                    : 'border-border bg-card/60 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Color Swatch */}
                    <div
                      className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center relative overflow-hidden shrink-0"
                      style={{ backgroundColor: canvasBg }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-2xs"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-semibold text-primary uppercase tracking-wider block">
                        {tpl.category}
                      </span>
                      <h5 className="font-semibold text-xs text-foreground leading-snug">
                        {tpl.name}
                      </h5>
                    </div>
                  </div>

                  {isCurrentPalette ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                      <Check className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-input bg-background hover:bg-muted text-foreground transition-all shadow-2xs"
                      data-testid={`apply-template-btn-${tpl.slug}`}
                    >
                      <span>Terapkan</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog Sebelum Menerapkan Template */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={`Terapkan Template "${selectedTemplate?.name}"?`}
        description="Gaya visual, palet warna, tipografi, dan susunan bagian akan diperbarui mengikuti template ini. Seluruh data mempelai, jadwal acara, dan foto galeri yang sudah Anda input TETAP AMAN dan tidak akan hilang."
        confirmLabel={isApplying ? 'Menerapkan...' : 'Ya, Terapkan Desain Ini'}
        cancelLabel="Batal"
        isLoading={isApplying}
        onConfirm={handleConfirmApply}
      />
    </div>
  );
};
