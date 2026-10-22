'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Palette } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { invitationsApi } from '@/services/api/invitations.api';
import { THEME_PALETTES } from '@/lib/style-helpers';

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
  const [isSlugManual, setIsSlugManual] = React.useState(false);
  const [selectedPaletteId, setSelectedPaletteId] = React.useState('dusty-rose');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-slug generator dari title
  const handleTitleChange = (val: string) => {
    setTitle(val);
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
      <DialogContent className="max-w-md" data-testid="create-invitation-dialog">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Pembuatan Undangan Baru</span>
          </div>
          <DialogTitle>Mulai Rancang Undangan Digital</DialogTitle>
          <DialogDescription>
            Masukkan nama acara dan tautan unik untuk membuka visual canvas editor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-medium mb-1 text-foreground">
              Judul Acara Pernikahan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Pernikahan Romeo & Juliet"
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
                placeholder="romeo-juliet"
                className="w-full bg-transparent border-0 p-0 text-xs text-foreground focus:outline-none font-mono font-medium"
                data-testid="create-invitation-slug-input"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Hanya huruf kecil, angka, dan tanda hubung (-).
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1.5 text-foreground flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span>Pilihan Palet Awal</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEME_PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setSelectedPaletteId(pal.id)}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                    selectedPaletteId === pal.id
                      ? 'border-primary ring-1 ring-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: pal.primaryColor }}
                  />
                  <span className="font-medium text-[11px] truncate">{pal.name}</span>
                </button>
              ))}
            </div>
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
