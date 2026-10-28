'use client';

import * as React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  BatteryCharging,
  Lock,
} from 'lucide-react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { resolveSectionComponent } from '@/modules/invitation-sections/registry';
import { CanvasSectionWrapper } from '@/modules/invitation-sections/canvas-section-wrapper';
import { CoverGateOverlay } from '@/modules/invitation-sections/cover-gate-overlay';
import { InvitationAudioPlayer } from '@/modules/invitation-sections/invitation-audio-player';
import { EditorDeviceToolbar } from './editor-device-toolbar';
import { cn } from '@/lib/utils';

export const EditorViewportCanvas: React.FC = () => {
  const invitation = useInvitationEditorStore((s) => s.invitation);
  const content = useInvitationEditorStore((s) => s.content);
  const sections = useInvitationEditorStore((s) => s.sections);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const viewportMode = useInvitationEditorStore((s) => s.viewportMode);
  const isLeftPanelCollapsed = useInvitationEditorStore((s) => s.isLeftPanelCollapsed);
  const toggleLeftPanel = useInvitationEditorStore((s) => s.toggleLeftPanel);
  const setActiveSection = useInvitationEditorStore((s) => s.setActiveSection);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const moveSection = useInvitationEditorStore((s) => s.moveSection);
  const duplicateSection = useInvitationEditorStore((s) => s.duplicateSection);
  const deleteSection = useInvitationEditorStore((s) => s.deleteSection);
  const isPro = useInvitationEditorStore((s) => s.isPro);

  // Status Cover Gate (di editor default dibuka agar langsung bisa edit, tapi bisa diuji via toolbar)
  const [isCoverOpen, setIsCoverOpen] = React.useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const canvasStyle = generateCanvasStyleVars(themeConfig);
  const visibleSections = sections.filter((s) => s.isVisible);

  // Ambil nama mempelai dari canonical content untuk preview cover
  const groomName = content.couple?.groom?.nickname || content.couple?.groom?.fullName || 'Pengantin Pria';
  const brideName = content.couple?.bride?.nickname || content.couple?.bride?.fullName || 'Pengantin Wanita';

  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    setIsPlayingAudio(true);
  };

  const renderCanvasContent = () => (
    <>
      {/* Interactive Cover Gate Overlay (Simulasi Layar Cover Pembuka) */}
      <CoverGateOverlay
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
        title={invitation?.title || 'Undangan Pernikahan'}
        groomName={groomName}
        brideName={brideName}
        guestName="Bapak Budi Santoso & Keluarga"
        themeConfig={themeConfig}
        isEditor
      />

      {/* Dynamic Invitation Canvas with Injected CSS Variables */}
      <div
        style={canvasStyle}
        data-testid="editor-invitation-canvas"
        data-viewport={viewportMode}
        className="flex-1 w-full overflow-y-auto font-sans relative bg-card @container"
      >
        {visibleSections.length === 0 ? (
          <div className="p-16 text-center text-xs opacity-50 space-y-2">
            <p>Belum ada bagian undangan yang aktif.</p>
            <p>Tambahkan bagian baru melalui panel kiri.</p>
          </div>
        ) : (
          visibleSections.map((sec, index) => {
            const Component = resolveSectionComponent(sec.type, sec.variant);
            return (
              <CanvasSectionWrapper
                key={sec.id}
                section={sec}
                isSelected={sec.id === activeSectionId}
                isFirst={index === 0}
                isLast={index === visibleSections.length - 1}
                onSelect={(id) => {
                  setActiveSection(id);
                }}
                onMoveUp={(id) => moveSection(id, 'up')}
                onMoveDown={(id) => moveSection(id, 'down')}
                onDuplicate={duplicateSection}
                onDelete={deleteSection}
              >
                <Component
                  id={sec.id}
                  content={content}
                  copy={sec.copy}
                  variant={sec.variant}
                  themeConfig={themeConfig}
                  isEditor
                  style={sec.style}
                  invitationId={invitation?.id}
                />
              </CanvasSectionWrapper>
            );
          })
        )}
      </div>

      {/* Floating Audio Player Preview in Editor */}
      <InvitationAudioPlayer
        isPlaying={isPlayingAudio}
        onTogglePlay={() => setIsPlayingAudio((prev) => !prev)}
        audioUrl={isPro ? (content.music?.audioUrl || themeConfig.audioUrl) : undefined}
      />
    </>
  );

  return (
    <div
      className="flex-1 flex flex-col h-full bg-background relative overflow-hidden"
      data-testid="editor-viewport-canvas-container"
      onClick={() => setActiveSection(null)}
    >
      {/* Dedicated Canvas Header Bar (Zero Overlap with Invitation Canvas) */}
      <div
        className="h-12 border-b border-border bg-card/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-20"
        data-testid="editor-canvas-header-bar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Collapsible Panel Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLeftPanel}
            title={isLeftPanelCollapsed ? 'Buka Panel Pengisian Data' : 'Sembunyikan Panel (Perluas Area Kanvas)'}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isLeftPanelCollapsed
                ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
                : 'border-border bg-muted/40 hover:bg-muted text-foreground'
            )}
            data-testid="toggle-left-panel-btn"
          >
            {isLeftPanelCollapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftClose className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {isLeftPanelCollapsed ? 'Tampilkan Panel' : 'Perluas Kanvas'}
            </span>
          </button>
        </div>

        {/* Center: Device Viewport Switcher Toolbar */}
        <EditorDeviceToolbar
          isCoverOpen={isCoverOpen}
          onToggleCover={() => setIsCoverOpen((prev) => !prev)}
        />

        {/* Right: Dimension Spec Indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
            {viewportMode === 'mobile' && '390 × 844 px (iPhone)'}
            {viewportMode === 'tablet' && '768 × 1024 px (iPad)'}
            {(viewportMode === 'laptop' || viewportMode === 'full') && '1024 × 768 px (MacBook)'}
          </span>
        </div>
      </div>

      {/* Canvas Scrollable Workspace */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6 md:p-8">
        {viewportMode === 'mobile' && (
          <div
            data-testid="editor-device-chassis"
            onClick={(e) => e.stopPropagation()}
            className="w-[390px] h-[820px] rounded-[48px] border-[10px] border-slate-800 dark:border-slate-700 shadow-2xl relative flex flex-col bg-card overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shrink-0 my-auto transition-all duration-300"
          >
            {/* iPhone Bezel & Dynamic Island Status Bar */}
            <div className="h-10 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 z-30 select-none text-[11px] font-medium tracking-tight">
              <span>09:41</span>
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 text-[8px] text-white/80 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <span className="font-mono text-[7px] text-slate-400">plannikah</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 opacity-80 text-[10px]">
                <Wifi className="w-3 h-3" />
                <BatteryCharging className="w-3 h-3" />
              </div>
            </div>

            {renderCanvasContent()}

            {/* iPhone Home Indicator */}
            <div className="h-5 bg-slate-900 flex items-center justify-center shrink-0 z-30 select-none">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        )}

        {viewportMode === 'tablet' && (
          <div
            data-testid="editor-device-chassis"
            onClick={(e) => e.stopPropagation()}
            className="w-[768px] h-[860px] rounded-[32px] border-[12px] border-slate-800 dark:border-slate-700 shadow-2xl relative flex flex-col bg-card overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shrink-0 my-auto transition-all duration-300"
          >
            {/* iPad Top Bezel & Status Bar */}
            <div className="h-8 bg-slate-900 text-white/80 flex items-center justify-between px-6 shrink-0 z-30 select-none text-[10px]">
              <span>09:41 - Sen, 24 Okt</span>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600/50 shadow-inner" />
              <div className="flex items-center gap-1.5 opacity-80">
                <Wifi className="w-3 h-3" />
                <span className="text-[9px]">100%</span>
                <BatteryCharging className="w-3 h-3" />
              </div>
            </div>

            {renderCanvasContent()}

            {/* iPad Bottom Bezel */}
            <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0 z-30 select-none">
              <div className="w-40 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
        )}

        {(viewportMode === 'laptop' || viewportMode === 'full') && (
          <div
            data-testid="editor-device-chassis"
            onClick={(e) => e.stopPropagation()}
            className="w-[1024px] max-w-full flex flex-col shrink-0 my-auto transition-all duration-300"
          >
            {/* MacBook Display Lid */}
            <div className="h-[740px] rounded-t-2xl border-[8px] border-b-0 border-slate-800 dark:border-slate-700 shadow-2xl bg-slate-900 flex flex-col overflow-hidden ring-1 ring-black/20">
              {/* Top Bezel with FaceTime Camera */}
              <div className="h-5 bg-slate-900 flex items-center justify-center shrink-0 z-30 relative">
                <div className="w-2 h-2 rounded-full bg-slate-700 ring-1 ring-slate-600 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
                </div>
              </div>

              {/* Browser Chrome Header */}
              <div className="h-10 bg-slate-800/95 border-b border-slate-700/80 px-4 flex items-center gap-3 shrink-0 z-30 text-white select-none">
                {/* macOS Window Controls */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>

                {/* Browser URL Bar */}
                <div className="flex-1 max-w-md mx-auto flex items-center gap-2 bg-slate-900/80 rounded-md px-3 py-1 border border-slate-700 text-xs font-mono text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="text-slate-400">https://</span>
                  <span className="text-white truncate">plannikah.com/{invitation?.slug || 'undangan'}</span>
                </div>

                <div className="w-12 text-right text-[10px] text-slate-400 font-mono">1024px</div>
              </div>

              {/* Canvas Content */}
              {renderCanvasContent()}
            </div>

            {/* MacBook Base / Bottom Hinge */}
            <div className="h-3 w-[1040px] max-w-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 dark:from-slate-700 dark:via-slate-500 dark:to-slate-700 rounded-b-xl shadow-lg mx-auto -mt-0.5 relative flex items-center justify-center">
              <div className="w-20 h-1 bg-slate-500/40 dark:bg-slate-800/50 rounded-b-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
