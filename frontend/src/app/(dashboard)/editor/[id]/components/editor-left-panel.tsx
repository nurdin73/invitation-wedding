'use client';

import * as React from 'react';
import { Layers, Palette, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvitationEditorStore, type EditorTab } from '@/lib/stores/invitation-editor.store';
import { EditorSectionsList } from './editor-sections-list';
import { EditorSectionInspector } from './editor-section-inspector';
import { EditorThemeSettings } from './editor-theme-settings';
import { EditorAddSectionModal } from './editor-add-section-modal';
import { ContentPanel } from './content/content-panel';

export const EditorLeftPanel: React.FC = () => {
  const activeTab = useInvitationEditorStore((s) => s.activeTab);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Jika sedang di tab inspector, highlight tab sections pada navigation bar
  const currentTabValue = activeTab === 'inspector' ? 'sections' : activeTab;

  return (
    <aside
      className="w-full lg:w-96 shrink-0 border-r border-border bg-card flex flex-col h-full overflow-hidden"
      data-testid="editor-left-panel"
    >
      {/* Tab Switcher */}
      <div className="p-3 border-b border-border bg-card-oat/30">
        <Tabs
          value={currentTabValue}
          onValueChange={(val) => setActiveTab(val as EditorTab)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger
              value="content"
              className="text-[11px] gap-1.5"
              data-testid="tab-content-trigger"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Isi Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="text-[11px] gap-1.5"
              data-testid="tab-design-trigger"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Desain</span>
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="text-[11px] gap-1.5"
              data-testid="tab-sections-trigger"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Susunan</span>
              {activeSectionId && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && <ContentPanel />}

        {activeTab === 'design' && <EditorThemeSettings />}

        {activeTab === 'sections' && (
          <EditorSectionsList onOpenAddModal={() => setIsAddModalOpen(true)} />
        )}

        {activeTab === 'inspector' && <EditorSectionInspector />}
      </div>

      {/* Section Library Picker Modal */}
      <EditorAddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </aside>
  );
};
