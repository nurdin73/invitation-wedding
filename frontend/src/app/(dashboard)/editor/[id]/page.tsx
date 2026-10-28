'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Send, Globe, Sparkles, Share2, Check } from 'lucide-react';
import { invitationsApi } from '@/services/api/invitations.api';
import { billingApi } from '@/services/api/billing.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { EditorLeftPanel } from './components/editor-left-panel';
import { EditorViewportCanvas } from './components/editor-viewport-canvas';
import { EditorRightPanel } from './components/editor-right-panel';
import { ProUpgradeDialog } from './components/pro/pro-upgrade-dialog';
import { GuestLinkGeneratorModal } from './components/guest-link-generator-modal';
import { useEditorAutosave } from './hooks/use-editor-autosave';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isGuestLinkModalOpen, setIsGuestLinkModalOpen] = React.useState(false);

  const invitation = useInvitationEditorStore((s) => s.invitation);
  const content = useInvitationEditorStore((s) => s.content);
  const sections = useInvitationEditorStore((s) => s.sections);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const isSaving = useInvitationEditorStore((s) => s.isSaving);
  const isPublishing = useInvitationEditorStore((s) => s.isPublishing);
  const isDirty = useInvitationEditorStore((s) => s.isDirty);
  const autoSaveStatus = useInvitationEditorStore((s) => s.autoSaveStatus);
  const isPro = useInvitationEditorStore((s) => s.isPro);
  const setSubscription = useInvitationEditorStore((s) => s.setSubscription);
  const setUpgradeModalOpen = useInvitationEditorStore((s) => s.setUpgradeModalOpen);
  const initEditor = useInvitationEditorStore((s) => s.initEditor);
  const setSaving = useInvitationEditorStore((s) => s.setSaving);
  const setPublishing = useInvitationEditorStore((s) => s.setPublishing);
  const markSaved = useInvitationEditorStore((s) => s.markSaved);

  const setHeader = useDashboardHeaderStore((s) => s.setHeader);
  const resetHeader = useDashboardHeaderStore((s) => s.resetHeader);

  // Aktifkan sinkronisasi debounced autosave (1000ms)
  useEditorAutosave(invitationId);

  // 1. Inisialisasi data undangan & status langganan
  React.useEffect(() => {
    let isMounted = true;

    billingApi
      .getSubscription()
      .then((subRes) => {
        if (isMounted && subRes.data) {
          setSubscription(subRes.data);
        }
      })
      .catch(() => {
        // Fallback default free
      });

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
  }, [invitationId, initEditor, setSubscription, router]);

  // 2. Action: Simpan Draft Manual
  const handleSaveDraft = React.useCallback(async () => {
    if (!invitation) return;
    setSaving(true);
    try {
      const res = await invitationsApi.saveDraft(invitation.id, {
        themeConfig: themeConfig as Record<string, unknown>,
        sections: sections as unknown[],
        content: content as unknown as Record<string, unknown>,
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
  }, [invitation, themeConfig, sections, content, setSaving, markSaved]);

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

    let saveLabel = 'Simpan Draft';
    let saveIcon = Save;
    if (autoSaveStatus === 'saving' || isSaving) {
      saveLabel = 'Menyimpan...';
    } else if (autoSaveStatus === 'saved') {
      saveLabel = 'Tersimpan Otomatis';
      saveIcon = Check;
    }

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
        ...(!isPro
          ? [
              {
                type: 'button' as const,
                button: {
                  id: 'editor-upgrade-pro',
                  label: 'Upgrade PRO',
                  icon: Sparkles,
                  variant: 'outline' as const,
                  onClick: () => setUpgradeModalOpen(true),
                  dataTestId: 'editor-topbar-upgrade-btn',
                },
              },
            ]
          : []),
        {
          type: 'button',
          button: {
            id: 'editor-save-draft',
            label: saveLabel,
            icon: saveIcon,
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
            triggerLabel: 'Bagikan & Tamu',
            items: [
              {
                id: 'share-guest-modal',
                label: 'Buat Tautan Tamu Personal',
                icon: Share2,
                disabled: !invitation.isPublished,
                onClick: () => setIsGuestLinkModalOpen(true),
              },
              {
                id: 'preview-guest',
                label: 'Buka Halaman Tamu Langsung',
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
  }, [
    invitation,
    isDirty,
    isSaving,
    autoSaveStatus,
    isPublishing,
    isPro,
    handleSaveDraft,
    handleTogglePublish,
    setHeader,
    resetHeader,
    setUpgradeModalOpen,
  ]);

  if (isLoading || !invitation) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
        Memuat editor kanvas undangan...
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col lg:flex-row h-full w-full flex-1 min-h-0 overflow-hidden bg-background relative"
        data-testid="editor-page-orchestrator"
      >
        <EditorLeftPanel />
        <EditorViewportCanvas />
        <EditorRightPanel />
      </div>
      <ProUpgradeDialog />
      <GuestLinkGeneratorModal
        isOpen={isGuestLinkModalOpen}
        onClose={() => setIsGuestLinkModalOpen(false)}
        slug={invitation.slug}
        title={invitation.title}
      />
    </>
  );
}
