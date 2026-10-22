'use client';

import * as React from 'react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { generateCanvasStyleVars } from '@/lib/style-helpers';
import { resolveSectionComponent } from '@/modules/invitation-sections/registry';
import { CanvasSectionWrapper } from '@/modules/invitation-sections/canvas-section-wrapper';
import { EditorDeviceToolbar } from './editor-device-toolbar';
import { cn } from '@/lib/utils';

export const EditorViewportCanvas: React.FC = () => {
  const sections = useInvitationEditorStore((s) => s.sections);
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const viewportMode = useInvitationEditorStore((s) => s.viewportMode);
  const setActiveSection = useInvitationEditorStore((s) => s.setActiveSection);
  const moveSection = useInvitationEditorStore((s) => s.moveSection);
  const duplicateSection = useInvitationEditorStore((s) => s.duplicateSection);
  const deleteSection = useInvitationEditorStore((s) => s.deleteSection);

  const canvasStyle = generateCanvasStyleVars(themeConfig);
  const visibleSections = sections.filter((s) => s.isVisible);

  return (
    <div
      className="flex-1 flex flex-col h-full bg-background relative overflow-hidden"
      data-testid="editor-viewport-canvas-container"
      onClick={() => setActiveSection(null)}
    >
      {/* Top Floating Device Viewport Controller */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <EditorDeviceToolbar />
      </div>

      {/* Canvas Scrollable Workspace */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center pt-16 pb-12 px-4">
        <div
          data-testid="editor-device-chassis"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'transition-all duration-300 relative shadow-2xl bg-card overflow-hidden flex flex-col',
            viewportMode === 'mobile' &&
              'w-[390px] min-h-[800px] rounded-[44px] border-[6px] border-slate-300 dark:border-slate-700 my-4',
            viewportMode === 'tablet' &&
              'w-[640px] min-h-[850px] rounded-[32px] border-[8px] border-slate-300 dark:border-slate-700 my-4',
            viewportMode === 'full' && 'w-full max-w-4xl min-h-screen rounded-xl border border-border my-2'
          )}
        >
          {/* Mobile Chassis Top Notch / Island */}
          {viewportMode === 'mobile' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-300 dark:bg-slate-700 rounded-full z-30 pointer-events-none" />
          )}

          {/* Dynamic Invitation Canvas with Injected CSS Variables */}
          <div
            style={canvasStyle}
            data-testid="editor-invitation-canvas"
            className="flex-1 w-full overflow-y-auto font-sans"
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
                    onSelect={setActiveSection}
                    onMoveUp={(id) => moveSection(id, 'up')}
                    onMoveDown={(id) => moveSection(id, 'down')}
                    onDuplicate={duplicateSection}
                    onDelete={deleteSection}
                  >
                    <Component
                      id={sec.id}
                      data={sec.data}
                      themeConfig={themeConfig}
                      isEditor
                    />
                  </CanvasSectionWrapper>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
