'use client';

import * as React from 'react';
import { X, SlidersHorizontal, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { cn } from '@/lib/utils';
import { EditorSectionInspector } from './editor-section-inspector';

export const EditorRightPanel: React.FC = () => {
  const isRightPanelOpen = useInvitationEditorStore((s) => s.isRightPanelOpen);
  const setRightPanelOpen = useInvitationEditorStore((s) => s.setRightPanelOpen);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const sections = useInvitationEditorStore((s) => s.sections);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <aside
      className={cn(
        'shrink-0 border-l border-border bg-card flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out',
        isRightPanelOpen
          ? 'w-full lg:w-80 xl:w-96 opacity-100'
          : 'w-0 opacity-0 pointer-events-none border-l-0'
      )}
      data-testid="editor-right-panel"
    >
      {/* Top Header of Right Inspector */}
      <div className="p-3 border-b border-border bg-card-oat/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary shrink-0" />
          <div className="truncate">
            <h4 className="font-semibold text-xs text-foreground truncate">
              {activeSection ? 'Inspektor Bagian' : 'Pengaturan Panel'}
            </h4>
            <p className="text-[10px] text-muted-foreground truncate">
              {activeSection ? `ID: ${activeSection.id}` : 'Pilih bagian di kanvas'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRightPanelOpen(false)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Tutup Panel Pengaturan"
          data-testid="editor-right-panel-close-btn"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <EditorSectionInspector />
      </div>
    </aside>
  );
};
