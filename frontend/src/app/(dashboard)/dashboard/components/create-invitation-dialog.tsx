'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, LayoutTemplate, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { invitationsApi } from '@/services/api/invitations.api';
import { templatesApi, type TemplateData } from '@/services/api/templates.api';

interface CreateInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateInvitationDialog: React.FC<CreateInvitationDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [groomNickname, setGroomNickname] = React.useState('');
  const [brideNickname, setBrideNickname] = React.useState('');
  const [isTitleManual, setIsTitleManual] = React.useState(false);
  const [isSlugManual, setIsSlugManual] = React.useState(false);
  const [templates, setTemplates] = React.useState<TemplateData[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [isLoadingTemplates, setIsLoadingTemplates] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch templates from database on mount / dialog open
  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingTemplates(true);
      templatesApi
        .getAll()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setTemplates(res.data);
            setSelectedTemplateId(res.data[0].id);
          }
        })
        .catch(() => {
          // Non-critical, fallback will work
        })
        .finally(() => {
          setIsLoadingTemplates(false);
        });
    }
  }, [isOpen]);

  const updateSuggestedNames = (groom: string, bride: string) => {
    if (!isTitleManual) {
      if (groom.trim() && bride.trim()) {
        const autoTitle = `Pernikahan ${groom.trim()} & ${bride.trim()}`;
        setTitle(autoTitle);
        if (!isSlugManual) {
          const autoSlug = `${groom.trim()}-${bride.trim()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          setSlug(autoSlug);
        }
      }
    }
  };

  const handleGroomChange = (val: string) => {
    setGroomNickname(val);
    updateSuggestedNames(val, brideNickname);
  };

  const handleBrideChange = (val: string) => {
    setBrideNickname(val);
    updateSuggestedNames(groomNickname, val);
  };

  // Auto-slug generator dari title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsTitleManual(true);
    if (!isSlugManual) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Mohon isi judul dan tautan undangan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await invitationsApi.create({
        title: title.trim(),
        slug: slug.trim(),
        templateId: selectedTemplateId || undefined,
        groomNickname: groomNickname.trim() || undefined,
        brideNickname: brideNickname.trim() || undefined,
      });

      if (response.data) {
        toast.success('Undangan baru berhasil dibuat!');
        onClose();
        if (onSuccess) onSuccess();
        // Langsung navigasi ke visual editor
        router.push(`/editor/${response.data.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat undangan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="create-invitation-dialog">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Pembuatan Undangan Baru</span>
          </div>
          <DialogTitle>Mulai Rancang Undangan Digital</DialogTitle>
          <DialogDescription>
            Pilih template desain siap pakai dan tentukan nama acara pernikahan Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* Pilihan Template Desain dari Database */}
          <div>
            <label className="block font-medium mb-1.5 text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
                <span>Pilih Template Siap Pakai</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Dapat dikustomisasi di editor
              </span>
            </label>

            {isLoadingTemplates ? (
              <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                Memuat daftar template desain...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {templates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  const primaryColor = (tpl.themeConfig?.primaryColor as string) || '#B86B70';
                  const canvasBg = (tpl.themeConfig?.canvasBackground as string) || '#FAF8F5';

                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      data-testid={`template-option-${tpl.slug}`}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`relative p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/40 bg-primary/5 shadow-sm'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}

                      <div>
                        {/* Mini Color Strip Preview */}
                        <div
                          className="h-10 rounded-md border border-black/10 flex items-center justify-center relative overflow-hidden mb-2"
                          style={{ backgroundColor: canvasBg }}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-white/40 shadow-xs"
                            style={{ backgroundColor: primaryColor }}
                          />
                        </div>

                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block">
                          {tpl.category}
                        </span>
                        <h4 className="font-semibold text-xs text-foreground mt-0.5 leading-snug">
                          {tpl.name}
                        </h4>
                      </div>

                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                        {tpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nama Panggilan Mempelai (Opsional untuk personalisasi cepat) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1 text-foreground">
                Panggilan Pria (Opsional)
              </label>
              <input
                type="text"
                value={groomNickname}
                onChange={(e) => handleGroomChange(e.target.value)}
                placeholder="Contoh: Rama"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="create-invitation-groom-nickname-input"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-foreground">
                Panggilan Wanita (Opsional)
              </label>
              <input
                type="text"
                value={brideNickname}
                onChange={(e) => handleBrideChange(e.target.value)}
                placeholder="Contoh: Shinta"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="create-invitation-bride-nickname-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-foreground">
              Judul Acara Pernikahan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Pernikahan Rama & Shinta"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-testid="create-invitation-title-input"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-foreground">
              Tautan Unik Undangan (Slug URL)
            </label>
            <div className="flex items-center rounded-md border border-input bg-muted/40 px-3 py-1.5 focus-within:ring-1 focus-within:ring-ring">
              <span className="text-muted-foreground font-mono select-none">
                website.com/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                }}
                placeholder="rama-shinta"
                className="w-full bg-transparent border-0 p-0 text-xs text-foreground focus:outline-none font-mono font-medium"
                data-testid="create-invitation-slug-input"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Hanya huruf kecil, angka, dan tanda hubung (-).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5"
              data-testid="create-invitation-submit-btn"
            >
              <span>{isSubmitting ? 'Membuat...' : 'Buka Editor Visual'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
