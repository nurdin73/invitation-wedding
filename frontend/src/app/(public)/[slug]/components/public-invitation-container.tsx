'use client';

import * as React from 'react';
import type { InvitationData } from '@/services/api/invitations.api';
import type { SectionNode, InvitationContent } from '@/modules/invitation-sections/types';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { resolveSectionComponent } from '@/modules/invitation-sections/registry';
import { SectionFrame } from '@/modules/invitation-sections/components/section-frame';
import { CoverGateOverlay } from '@/modules/invitation-sections/cover-gate-overlay';
import { InvitationAudioPlayer } from '@/modules/invitation-sections/invitation-audio-player';
import { getCoupleDisplayNames } from '@/modules/invitation-sections/content-format.utils';
import { cn } from '@/lib/utils';

interface PublicInvitationContainerProps {
  invitation: InvitationData;
  guestName?: string;
}

export const PublicInvitationContainer: React.FC<PublicInvitationContainerProps> = ({
  invitation,
  guestName,
}) => {
  const [isCoverOpen, setIsCoverOpen] = React.useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const canvasStyle = generateCanvasStyleVars(invitation.themeConfig);
  const sections = (Array.isArray(invitation.sections) ? invitation.sections : []) as unknown as SectionNode[];
  const visibleSections = sections.filter((s) => s.isVisible);

  const content = (invitation.content || {}) as InvitationContent;
  const { groom, bride } = getCoupleDisplayNames(content?.couple);

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setIsPlayingAudio(true);
  };

  const audioUrl = content?.music?.audioUrl || (invitation.themeConfig as Record<string, unknown>)?.audioUrl as string | undefined;

  return (
    <div
      className={cn(
        'w-full max-w-md bg-background shadow-2xl relative flex flex-col',
        !isCoverOpen ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen overflow-y-auto'
      )}
      data-testid="public-invitation-container"
    >
      {/* Layar Khusus Cover Pembuka (Cover Gate Screen) */}
      <CoverGateOverlay
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
        title={invitation.title}
        groomName={groom}
        brideName={bride}
        guestName={guestName}
        themeConfig={invitation.themeConfig}
        isEditor={false}
      />

      {/* Main Rangkaian Konten Undangan (Scrollable setelah dibuka) */}
      <main
        style={canvasStyle}
        className="min-h-screen flex flex-col font-sans"
        data-testid="guest-invitation-view"
      >
        {visibleSections.length === 0 ? (
          <div className="my-auto p-12 text-center text-xs opacity-60">
            Undangan pernikahan belum memiliki bagian konten yang dipublikasikan.
          </div>
        ) : (
          visibleSections.map((sec) => {
            const Component = resolveSectionComponent(sec.type, sec.variant);
            return (
              <SectionFrame key={sec.id} styleConfig={sec.style}>
                <Component
                  id={sec.id}
                  content={content}
                  copy={sec.copy}
                  variant={sec.variant}
                  themeConfig={invitation.themeConfig}
                  isEditor={false}
                  style={sec.style}
                  invitationId={invitation.id}
                />
              </SectionFrame>
            );
          })
        )}
      </main>

      {/* Floating Audio Player */}
      <InvitationAudioPlayer
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio((prev) => !prev)}
        audioUrl={audioUrl}
      />
    </div>
  );
};
