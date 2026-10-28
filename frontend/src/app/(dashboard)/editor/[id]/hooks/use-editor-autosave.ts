'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { invitationsApi } from '@/services/api/invitations.api';

const AUTOSAVE_DEBOUNCE_MS = 1000;

export function useEditorAutosave(invitationId: string) {
  const content = useInvitationEditorStore((s) => s.content);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const sections = useInvitationEditorStore((s) => s.sections);
  const isDirty = useInvitationEditorStore((s) => s.isDirty);
  const isSaving = useInvitationEditorStore((s) => s.isSaving);
  const autoSaveStatus = useInvitationEditorStore((s) => s.autoSaveStatus);
  const setSaving = useInvitationEditorStore((s) => s.setSaving);
  const markSaved = useInvitationEditorStore((s) => s.markSaved);
  const setAutoSaveStatus = useInvitationEditorStore((s) => s.setAutoSaveStatus);

  // Simpan data state terbaru di ref agar debounce selalu membaca nilai terakhir
  const payloadRef = React.useRef({ content, themeConfig, sections });
  React.useEffect(() => {
    payloadRef.current = { content, themeConfig, sections };
  }, [content, themeConfig, sections]);

  React.useEffect(() => {
    if (!invitationId || !isDirty || isSaving) {
      return;
    }

    const timer = setTimeout(async () => {
      setSaving(true);
      setAutoSaveStatus('saving');

      try {
        const payload = payloadRef.current;
        const res = await invitationsApi.saveDraft(invitationId, {
          themeConfig: payload.themeConfig as Record<string, unknown>,
          sections: payload.sections as unknown[],
          content: payload.content as unknown as Record<string, unknown>,
        });

        if (res.data) {
          markSaved(res.data);
          setAutoSaveStatus('saved');
        } else {
          setAutoSaveStatus('error');
        }
      } catch (err) {
        console.warn('Debounced autosave failed:', err);
        setAutoSaveStatus('error');
      } finally {
        setSaving(false);
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [invitationId, isDirty, isSaving, setSaving, markSaved, setAutoSaveStatus]);

  return { autoSaveStatus, isSaving };
}
