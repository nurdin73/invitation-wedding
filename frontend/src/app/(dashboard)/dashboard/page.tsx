'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Sparkles, HelpCircle, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';
import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { CreateInvitationDialog } from './components/create-invitation-dialog';

const MAX_DRAFTS = 10;

export default function DashboardPage() {
  const [invitations, setInvitations] = React.useState<InvitationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
    const isLimitReached = invitations.length >= MAX_DRAFTS;

    setHeader({
      title: 'Undangan Pernikahan Saya',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Undangan Saya' },
      ],
      showBackButton: false,
      actions: [
        ...(invitations.length > 0
          ? [
              {
                type: 'button' as const,
                button: {
                  id: 'dashboard-limit-badge',
                  label: `${invitations.length}/${MAX_DRAFTS} Draf (${isLimitReached ? 'Penuh' : 'Tersedia'})`,
                  variant: 'outline' as const,
                  disabled: true,
                  dataTestId: 'dashboard-invitation-limit-badge',
                },
              },
            ]
          : []),
        {
          type: 'button' as const,
          button: {
            id: 'dashboard-create-btn',
            label: 'Buat Undangan Baru',
            icon: Plus,
            variant: 'default' as const,
            disabled: isLimitReached,
            onClick: () => {
              setIsDialogOpen(true);
            },
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
  }, [setHeader, resetHeader, invitations.length]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await invitationsApi.delete(deleteTarget.id);
      toast.success('Undangan berhasil dihapus.');
      setDeleteTarget(null);
      fetchInvitations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus undangan.');
    } finally {
      setIsDeleting(false);
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

      {/* Confirmation Dialog Hapus Undangan */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Undangan Pernikahan?"
        description={`Undangan "${deleteTarget?.title || ''}" dan seluruh data di dalamnya akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel={isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
        cancelLabel="Batal"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
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
              Mulai rancang undangan digital pernikahan impian Anda dengan template elegan dan kemudahan kustomisasi langsung di editor.
            </p>
          </div>
          <Button
            size="sm"
            data-testid="dashboard-empty-create-btn"
            onClick={() => setIsDialogOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Buat Undangan</span>
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
                        ? 'bg-success text-success-foreground border border-success-foreground/20'
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
                  onClick={() => setDeleteTarget({ id: inv.id, title: inv.title })}
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
