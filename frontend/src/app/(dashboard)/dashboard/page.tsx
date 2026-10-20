'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';

export default function DashboardPage() {
  const [invitations, setInvitations] = React.useState<InvitationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newSlug, setNewSlug] = React.useState('');

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Daftar Undangan Pernikahan
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola dan edit desain undangan pernikahan digital Anda.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          data-testid="dashboard-create-invitation-btn"
        >
          {isCreating ? 'Tutup Formulir' : '+ Buat Undangan Baru'}
        </Button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border bg-card p-4 space-y-4 shadow-sm max-w-lg"
          data-testid="dashboard-create-form"
        >
          <h3 className="text-base font-semibold text-foreground">Buat Undangan Baru</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Judul Undangan</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Pernikahan Romeo & Juliet"
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tautan Unik (Slug)</label>
            <input
              type="text"
              required
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="romeo-juliet"
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
          <Button type="submit" size="sm">
            Simpan & Buka Editor
          </Button>
        </form>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Memuat data undangan...
        </div>
      ) : invitations.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Anda belum memiliki undangan pernikahan.
          </p>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            Mulai Buat Undangan Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm"
              data-testid={`invitation-card-${inv.id}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
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
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {inv.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-3 border-t">
                <Link href={`/editor/${inv.id}`} className="flex-1">
                  <Button variant="default" size="sm" className="w-full">
                    Buka Editor
                  </Button>
                </Link>
                {inv.isPublished && (
                  <Link href={`/${inv.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
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
