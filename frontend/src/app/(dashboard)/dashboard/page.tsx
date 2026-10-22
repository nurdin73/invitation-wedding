'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, X, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';

export default function DashboardPage() {
  const [invitations, setInvitations] = React.useState<InvitationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newSlug, setNewSlug] = React.useState('');

  const setHeader = useDashboardHeaderStore((s) => s.setHeader);
  const resetHeader = useDashboardHeaderStore((s) => s.resetHeader);

  const fetchInvitations = React.useCallback(async () => {
    try {
      const response = await invitationsApi.getAll();
      if (response.data) {
        setInvitations(response.data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat daftar undangan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Daftarkan konfigurasi breadcrumb, title, dan action buttons ke header store
  React.useEffect(() => {
    setHeader({
      title: 'Daftar Undangan Pernikahan',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Undangan Saya' },
      ],
      showBackButton: false,
      actions: [
        {
          type: 'button',
          button: {
            id: 'toggle-create-form',
            label: isCreating ? 'Tutup Formulir' : 'Buat Undangan Baru',
            icon: isCreating ? X : Plus,
            variant: isCreating ? 'outline' : 'default',
            onClick: () => setIsCreating((prev) => !prev),
            dataTestId: 'dashboard-create-invitation-btn',
          },
        },
        {
          type: 'dropdown',
          dropdown: {
            id: 'dashboard-quick-menu',
            triggerLabel: 'Bantuan & Tips',
            triggerIcon: HelpCircle,
            items: [
              {
                id: 'tip-guide',
                label: 'Panduan Desain Undangan',
                icon: Sparkles,
                onClick: () => {
                  toast.info('Tips: Gunakan foto berkualitas tinggi agar tampilan undangan optimal.');
                },
              },
            ],
          },
        },
      ],
    });

    return () => {
      resetHeader();
    };
  }, [isCreating, setHeader, resetHeader]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;

    try {
      const response = await invitationsApi.create({ title: newTitle, slug: newSlug });
      if (response.data) {
        toast.success('Undangan berhasil dibuat!');
        setNewTitle('');
        setNewSlug('');
        setIsCreating(false);
        fetchInvitations();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat undangan.');
    }
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Formulir Buat Undangan Baru */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border bg-card p-5 space-y-4 shadow-sm max-w-lg transition-all"
          data-testid="dashboard-create-form"
        >
          <div className="border-b border-border pb-2">
            <h2 className="text-base font-semibold text-foreground">Buat Undangan Baru</h2>
            <p className="text-xs text-muted-foreground">
              Masukkan judul dan tautan unik untuk mulai mendesain undangan Anda.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-foreground">
              Judul Undangan
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Pernikahan Romeo & Juliet"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-foreground">
              Tautan Unik (Slug)
            </label>
            <input
              type="text"
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="romeo-juliet"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" size="sm">
              Simpan & Buka Editor
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              Batal
            </Button>
          </div>
        </form>
      )}

      {/* Grid Konten Undangan */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          Memuat data undangan...
        </div>
      ) : invitations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card-oat/50">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Anda belum memiliki undangan pernikahan.
          </p>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            Mulai Buat Undangan Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm hover:border-primary/40 transition-colors"
              data-testid={`invitation-card-${inv.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      inv.isPublished
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {inv.isPublished ? 'Dipublikasikan' : 'Draft'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    /{inv.slug}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
                  {inv.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border">
                <Link href={`/editor/${inv.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full text-xs">
                    Buka Editor
                  </Button>
                </Link>
                {inv.isPublished && (
                  <Link href={`/${inv.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="text-xs">
                      Lihat Tamu
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
