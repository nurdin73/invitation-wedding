'use client';

import * as React from 'react';
import { Layers, Sliders, Palette } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useInvitationEditorStore, type EditorTab } from '@/lib/stores/invitation-editor.store';
import { EditorSectionsList } from './editor-sections-list';
import { EditorSectionInspector } from './editor-section-inspector';
import { EditorThemeSettings } from './editor-theme-settings';
import { EditorAddSectionModal } from './editor-add-section-modal';

export const EditorLeftPanel: React.FC = () => {
  const activeTab = useInvitationEditorStore((s) => s.activeTab);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <aside
      className="w-full lg:w-96 shrink-0 border-r border-border bg-card flex flex-col h-full overflow-hidden"
      data-testid="editor-left-panel"
    >
      {/* Tab Switcher */}
      <div className="p-3 border-b border-border bg-card-oat/30">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as EditorTab)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="sections" className="text-[11px] gap-1.5" data-testid="tab-sections-trigger">
              <Layers className="w-3.5 h-3.5" />
              <span>Struktur</span>
            </TabsTrigger>
            <TabsTrigger
              value="inspector"
              className="text-[11px] gap-1.5"
              data-testid="tab-inspector-trigger"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Konten</span>
              {activeSectionId && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
            <TabsTrigger value="theme" className="text-[11px] gap-1.5" data-testid="tab-theme-trigger">
              <Palette className="w-3.5 h-3.5" />
              <span>Tema</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'sections' && (
          <EditorSectionsList onOpenAddModal={() => setIsAddModalOpen(true)} />
        )}

        {activeTab === 'inspector' && (
          <EditorSectionInspector />
        )}

        {activeTab === 'theme' && (
          <EditorThemeSettings />
        )}
      </div>

      {/* Section Library Picker Modal */}
      <EditorAddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </aside>
  );
};
