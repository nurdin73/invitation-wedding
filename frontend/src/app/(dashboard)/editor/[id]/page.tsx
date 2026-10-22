'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Send, Globe } from 'lucide-react';
import { invitationsApi } from '@/services/api/invitations.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { EditorLeftPanel } from './components/editor-left-panel';
import { EditorViewportCanvas } from './components/editor-viewport-canvas';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [isLoading, setIsLoading] = React.useState(true);

  const invitation = useInvitationEditorStore((s) => s.invitation);
  const sections = useInvitationEditorStore((s) => s.sections);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const isSaving = useInvitationEditorStore((s) => s.isSaving);
  const isPublishing = useInvitationEditorStore((s) => s.isPublishing);
  const isDirty = useInvitationEditorStore((s) => s.isDirty);
  const initEditor = useInvitationEditorStore((s) => s.initEditor);
  const setSaving = useInvitationEditorStore((s) => s.setSaving);
  const setPublishing = useInvitationEditorStore((s) => s.setPublishing);
  const markSaved = useInvitationEditorStore((s) => s.markSaved);

  const setHeader = useDashboardHeaderStore((s) => s.setHeader);
  const resetHeader = useDashboardHeaderStore((s) => s.resetHeader);

  // 1. Inisialisasi data undangan
  React.useEffect(() => {
    let isMounted = true;
    invitationsApi
      .getById(invitationId)
      .then((res) => {
        if (isMounted && res.data) {
          initEditor(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          toast.error(err instanceof Error ? err.message : 'Gagal memuat undangan.');
          router.push('/dashboard');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationId, initEditor, router]);

  // 2. Action: Simpan Draft
  const handleSaveDraft = React.useCallback(async () => {
    if (!invitation) return;
    setSaving(true);
    try {
      const res = await invitationsApi.saveDraft(invitation.id, {
        themeConfig: themeConfig as Record<string, unknown>,
        sections: sections as unknown[],
      });
      if (res.data) {
        markSaved(res.data);
        toast.success('Draft undangan berhasil disimpan!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan draft.');
    } finally {
      setSaving(false);
    }
  }, [invitation, themeConfig, sections, setSaving, markSaved]);

  // 3. Action: Toggle Publikasi
  const handleTogglePublish = React.useCallback(async () => {
    if (!invitation) return;
    setPublishing(true);
    try {
      if (invitation.isPublished) {
        const res = await invitationsApi.unpublish(invitation.id);
        if (res.data) markSaved(res.data);
        toast.success('Publikasi undangan dinonaktifkan.');
      } else {
        const res = await invitationsApi.publish(invitation.id);
        if (res.data) markSaved(res.data);
        toast.success('Undangan berhasil dipublikasikan!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengubah status publikasi.');
    } finally {
      setPublishing(false);
    }
  }, [invitation, setPublishing, markSaved]);

  // 4. Daftarkan header topbar
  React.useEffect(() => {
    if (!invitation) return;

    setHeader({
      title: `${invitation.title}${isDirty ? ' (Belum Disimpan)' : ''}`,
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
            variant: isDirty ? 'default' : 'outline',
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
            triggerLabel: 'Tampilan Tamu',
            items: [
              {
                id: 'preview-guest',
                label: 'Buka Halaman Tamu',
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
  }, [invitation, isDirty, isSaving, isPublishing, handleSaveDraft, handleTogglePublish, setHeader, resetHeader]);

  if (isLoading || !invitation) {
    return (
      <div className="flex h-[75vh] items-center justify-center text-xs text-muted-foreground">
        Memuat editor kanvas undangan...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col lg:flex-row h-[calc(100vh-7.5rem)] w-full rounded-xl border border-border overflow-hidden bg-background shadow-xs"
      data-testid="editor-page-orchestrator"
    >
      <EditorLeftPanel />
      <EditorViewportCanvas />
    </div>
  );
}
