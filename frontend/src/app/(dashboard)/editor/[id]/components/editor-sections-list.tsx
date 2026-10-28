'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Trash2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import type { SectionNode } from '@/modules/invitation-sections/types';

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Cover Utama (Hero)',
  quote: 'Kutipan & Ayat Suci',
  couple: 'Profil Mempelai',
  event: 'Jadwal Acara',
  gallery: 'Galeri Foto',
  story: 'Kisah Cinta',
  rsvp: 'Konfirmasi RSVP',
  gift: 'Kado & Angpao Digital',
  footer: 'Penutup & Doa',
};

interface SortableItemProps {
  section: SectionNode;
  isActive: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableSectionItem: React.FC<SortableItemProps> = ({
  section,
  isActive,
  onSelect,
  onToggleVisibility,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const label = SECTION_TYPE_LABELS[section.type] || section.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`editor-section-item-${section.id}`}
      onClick={() => onSelect(section.id)}
      className={cn(
        'group flex items-center justify-between gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors',
        isActive
          ? 'border-primary bg-primary/5 text-primary shadow-xs'
          : 'border-border bg-card hover:border-primary/40 text-foreground',
        !section.isVisible && 'opacity-50'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
          title="Geser untuk mengubah urutan"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <div className="truncate">
          <p className="truncate font-semibold">
            {label}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase font-mono">
            Varian: {section.variant}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onToggleVisibility(section.id)}
          title={section.isVisible ? 'Sembunyikan' : 'Tampilkan'}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => onDelete(section.id)}
          title="Hapus Bagian"
          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

interface EditorSectionsListProps {
  onOpenAddModal: () => void;
}

export const EditorSectionsList: React.FC<EditorSectionsListProps> = ({ onOpenAddModal }) => {
  const sections = useInvitationEditorStore((s) => s.sections);
  const activeSectionId = useInvitationEditorStore((s) => s.activeSectionId);
  const setActiveSection = useInvitationEditorStore((s) => s.setActiveSection);
  const reorderSections = useInvitationEditorStore((s) => s.reorderSections);
  const toggleSectionVisibility = useInvitationEditorStore((s) => s.toggleSectionVisibility);
  const deleteSection = useInvitationEditorStore((s) => s.deleteSection);
  const setActiveTab = useInvitationEditorStore((s) => s.setActiveTab);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-4" data-testid="editor-sections-list">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Struktur Bagian Undangan
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Tahan dan geser handle untuk mengatur urutan tampilan.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={onOpenAddModal}
          data-testid="editor-add-section-btn"
          className="h-7 text-xs gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((sec) => (
              <SortableSectionItem
                key={sec.id}
                section={sec}
                isActive={sec.id === activeSectionId}
                onSelect={handleSelectSection}
                onToggleVisibility={toggleSectionVisibility}
                onDelete={deleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="w-full py-3 px-4 border border-dashed border-border rounded-lg text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tambah Bagian Baru ke Undangan</span>
        </button>
      </div>
    </div>
  );
};
