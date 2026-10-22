'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Sparkles, HelpCircle, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';
import { CreateInvitationDialog } from './components/create-invitation-dialog';

export default function DashboardPage() {
  const [invitations, setInvitations] = React.useState<InvitationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

  // Daftarkan konfigurasi breadcrumb, title, dan action button ke header store
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
            id: 'dashboard-create-btn',
            label: 'Buat Undangan Baru',
            icon: Plus,
            variant: 'default',
            onClick: () => setIsDialogOpen(true),
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
                label: 'Tips Desain Visual',
                icon: Sparkles,
                onClick: () => {
                  toast.info('Tips: Gunakan foto resolusi tinggi dan warna palet yang kontras untuk kenyamanan mata tamu.');
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
  }, [setHeader, resetHeader]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus undangan "${title}"?`)) return;

    try {
      await invitationsApi.delete(id);
      toast.success('Undangan berhasil dihapus.');
      fetchInvitations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus undangan.');
    }
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Modal Dialog Buat Undangan Baru */}
      <CreateInvitationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchInvitations}
      />

      {/* Grid Konten Undangan */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          Memuat data undangan Anda...
        </div>
      ) : invitations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center bg-card-oat/40 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Belum Ada Undangan
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Mulai buat undangan pernikahan digital pertama Anda dengan editor interaktif kami.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            data-testid="dashboard-empty-create-btn"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Undangan Sekarang</span>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 transition-all group"
              data-testid={`invitation-card-${inv.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      inv.isPublished
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {inv.isPublished ? 'Dipublikasikan' : 'Draft'}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    /{inv.slug}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
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
                    <Button variant="outline" size="sm" className="px-2.5" title="Lihat Tampilan Publik">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(inv.id, inv.title)}
                  className="px-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Hapus Undangan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
