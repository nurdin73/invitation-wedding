'use client';

import * as React from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionFrame } from './components/section-frame';
import type { SectionNode } from './types';

interface CanvasSectionWrapperProps {
  section: SectionNode;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export const CanvasSectionWrapper: React.FC<CanvasSectionWrapperProps> = ({
  section,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  children,
}) => {
  return (
    <div
      data-testid={`canvas-section-wrapper-${section.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(section.id);
      }}
      className={cn(
        'relative group cursor-pointer transition-all duration-150',
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 z-20'
          : 'hover:outline-1 hover:outline-dashed hover:outline-primary/50'
      )}
    >
      {/* Floating Action Bar on Selection or Hover */}
      {isSelected && (
        <div
          data-testid={`canvas-section-toolbar-${section.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-3 z-30 flex items-center gap-0.5 bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-xl text-[10px] font-medium"
        >
          <span className="uppercase tracking-wider mr-1.5 opacity-90 font-mono">
            {section.type}
          </span>

          <button
            type="button"
            title="Pindah ke Atas"
            disabled={isFirst}
            onClick={() => onMoveUp(section.id)}
            className="p-1 hover:bg-black/20 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowUp className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Pindah ke Bawah"
            disabled={isLast}
            onClick={() => onMoveDown(section.id)}
            className="p-1 hover:bg-black/20 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Duplikat Bagian"
            onClick={() => onDuplicate(section.id)}
            className="p-1 hover:bg-black/20 rounded transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Edit Properti di Panel"
            onClick={() => onSelect(section.id)}
            className="p-1 hover:bg-black/20 rounded transition-colors"
          >
            <Settings2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Hapus Bagian"
            onClick={() => onDelete(section.id)}
            className="p-1 hover:bg-destructive text-white rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <SectionFrame styleConfig={section.style}>
        {children}
      </SectionFrame>
    </div>
  );
};
