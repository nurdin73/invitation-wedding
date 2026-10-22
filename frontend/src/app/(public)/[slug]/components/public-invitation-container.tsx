'use client';

import * as React from 'react';
import type { InvitationData } from '@/services/api/invitations.api';
import type { SectionNode, HeroSectionData } from '@/modules/invitation-sections/types';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { resolveSectionComponent } from '@/modules/invitation-sections/registry';
import { CoverGateOverlay } from '@/modules/invitation-sections/cover-gate-overlay';
import { InvitationAudioPlayer } from '@/modules/invitation-sections/invitation-audio-player';
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

  // Ambil nama pengantin dari Hero section untuk cover
  const heroSection = sections.find((s) => s.type === 'hero');
  const heroData = (heroSection?.data || {}) as HeroSectionData;

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setIsPlayingAudio(true);
  };

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
        groomName={heroData.groomName}
        brideName={heroData.brideName}
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
              <Component
                key={sec.id}
                id={sec.id}
                data={sec.data}
                themeConfig={invitation.themeConfig}
                isEditor={false}
              />
            );
          })
        )}
      </main>

      {/* Floating Audio Player */}
      <InvitationAudioPlayer
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio((prev) => !prev)}
        audioUrl={invitation.themeConfig?.audioUrl as string | undefined}
      />
    </div>
  );
};
