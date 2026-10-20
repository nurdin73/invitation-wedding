'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { invitationsApi, type InvitationData } from '@/services/api/invitations.api';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = React.useState<InvitationData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

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

  const handleSaveDraft = async () => {
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
  };

  const handleTogglePublish = async () => {
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
  };

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
    <div className="flex flex-col h-[calc(100vh-5rem)]" data-testid="editor-page">
      {/* Editor Chrome Topbar Toolbar */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-2.5 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            ← Kembali
          </Button>
          <div>
            <h2 className="font-semibold text-sm text-foreground">{invitation.title}</h2>
            <span className="text-xs text-muted-foreground font-mono">/{invitation.slug}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving}
            data-testid="editor-topbar-save-btn"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
          </Button>

          <Button
            variant={invitation.isPublished ? 'secondary' : 'default'}
            size="sm"
            onClick={handleTogglePublish}
            disabled={isPublishing}
            data-testid="editor-topbar-publish-btn"
          >
            {isPublishing
              ? 'Memproses...'
              : invitation.isPublished
              ? 'Tarik Publikasi'
              : 'Publikasikan'}
          </Button>
        </div>
      </div>

      {/* Editor Center Viewport: Mobile Chassis Mockup */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-muted/40 rounded-xl">
        <div
          data-testid="editor-mobile-chassis"
          className="relative w-[390px] h-[780px] bg-card rounded-[40px] border-4 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col"
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
