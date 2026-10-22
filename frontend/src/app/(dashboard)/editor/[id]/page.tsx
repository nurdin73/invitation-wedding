'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Send, Eye, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = React.useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const setHeader = useDashboardHeaderStore((s) => s.setHeader);
  const resetHeader = useDashboardHeaderStore((s) => s.resetHeader);

  const fetchDetail = React.useCallback(async () => {
    try {
      const res = await invitationsApi.getById(invitationId);
      if (res.data) {
        setInvitation(res.data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat undangan.');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [invitationId, router]);

  React.useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleSaveDraft = React.useCallback(async () => {
    if (!invitation) return;
    setIsSaving(true);
    try {
      const res = await invitationsApi.saveDraft(invitation.id, {
        themeConfig: invitation.themeConfig,
        sections: invitation.sections,
      });
      if (res.data) {
        setInvitation(res.data);
        toast.success('Draft berhasil disimpan!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan draft.');
    } finally {
      setIsSaving(false);
    }
  }, [invitation]);

  const handleTogglePublish = React.useCallback(async () => {
    if (!invitation) return;
    setIsPublishing(true);
    try {
      if (invitation.isPublished) {
        const res = await invitationsApi.unpublish(invitation.id);
        if (res.data) setInvitation(res.data);
        toast.success('Publikasi dinonaktifkan.');
      } else {
        const res = await invitationsApi.publish(invitation.id);
        if (res.data) setInvitation(res.data);
        toast.success('Undangan berhasil dipublikasikan!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengubah status publikasi.');
    } finally {
      setIsPublishing(false);
    }
  }, [invitation]);

  // Daftarkan konfigurasi breadcrumb, title, back button, dan actions ke header store
  React.useEffect(() => {
    if (!invitation) return;

    setHeader({
      title: invitation.title,
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Undangan Saya', href: '/dashboard' },
        { label: invitation.title },
      ],
      showBackButton: true,
      backButtonHref: '/dashboard',
      actions: [
        {
          type: 'button',
          button: {
            id: 'editor-save-draft',
            label: isSaving ? 'Menyimpan...' : 'Simpan Draft',
            icon: Save,
            variant: 'outline',
            disabled: isSaving,
            onClick: handleSaveDraft,
            dataTestId: 'editor-topbar-save-btn',
          },
        },
        {
          type: 'button',
          button: {
            id: 'editor-publish',
            label: isPublishing
              ? 'Memproses...'
              : invitation.isPublished
              ? 'Tarik Publikasi'
              : 'Publikasikan',
            icon: Send,
            variant: invitation.isPublished ? 'secondary' : 'default',
            disabled: isPublishing,
            onClick: handleTogglePublish,
            dataTestId: 'editor-topbar-publish-btn',
          },
        },
        {
          type: 'dropdown',
          dropdown: {
            id: 'editor-options',
            triggerLabel: 'Opsi Tampilan',
            items: [
              {
                id: 'preview-guest',
                label: 'Lihat Tampilan Tamu',
                icon: Globe,
                disabled: !invitation.isPublished,
                onClick: () => {
                  window.open(`/${invitation.slug}`, '_blank');
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
  }, [invitation, isSaving, isPublishing, handleSaveDraft, handleTogglePublish, setHeader, resetHeader]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm text-muted-foreground">
        Memuat editor kanvas...
      </div>
    );
  }

  if (!invitation) return null;

  const canvasStyle = generateCanvasStyleVars(invitation.themeConfig);

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] w-full" data-testid="editor-page">
      {/* Editor Center Viewport: Mobile Chassis Mockup */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4 sm:p-6 bg-muted/40 rounded-xl">
        <div
          data-testid="editor-mobile-chassis"
          className="relative w-[390px] h-[780px] bg-card rounded-[40px] border-4 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col my-4"
        >
          {/* Mobile Screen Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-300 dark:bg-slate-700 rounded-full z-20 pointer-events-none" />

          {/* Dynamic Invitation Canvas with Injected CSS Variables */}
          <div
            style={canvasStyle}
            className="flex-1 overflow-y-auto pt-8 px-4 text-center font-sans"
            style-target="invitation-canvas"
          >
            <div className="py-12 space-y-4" style={{ backgroundColor: 'var(--inv-bg)' }}>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Walimatul Ursy
              </span>
              <h1
                className="text-3xl font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--inv-font-heading)',
                  color: 'var(--inv-primary)',
                }}
              >
                {invitation.title}
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Dengan penuh rasa syukur, kami mengundang Anda untuk hadir dalam momen bahagia pernikahan kami.
              </p>

              <div className="pt-6">
                <Button
                  size="sm"
                  style={{
                    backgroundColor: 'var(--inv-primary)',
                    color: '#FFFFFF',
                  }}
                >
                  Buka Undangan
                </Button>
              </div>
            </div>

            {/* Render sections stack preview */}
            <div className="space-y-4 py-6">
              {invitation.sections.map((sec, idx) => {
                const s = sec as { id?: string; type?: string };
                return (
                  <div
                    key={s.id || idx}
                    className="rounded-lg border p-4 bg-background/80 shadow-sm text-xs text-muted-foreground"
                  >
                    Section [{s.type || 'content'}] #{idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
