'use client';

import * as React from 'react';
import { Smartphone, Tablet, Laptop, Eye, EyeOff } from 'lucide-react';
import { useInvitationEditorStore, type ViewportMode } from '@/lib/stores/invitation-editor.store';
import { cn } from '@/lib/utils';

interface EditorDeviceToolbarProps {
  isCoverOpen?: boolean;
  onToggleCover?: () => void;
}

export const EditorDeviceToolbar: React.FC<EditorDeviceToolbarProps> = ({
  isCoverOpen = true,
  onToggleCover,
}) => {
  const viewportMode = useInvitationEditorStore((s) => s.viewportMode);
  const setViewportMode = useInvitationEditorStore((s) => s.setViewportMode);

  const devices: { mode: ViewportMode; label: string; widthLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'mobile', label: 'Ponsel', widthLabel: '390px', icon: Smartphone },
    { mode: 'tablet', label: 'Tablet', widthLabel: '768px', icon: Tablet },
    { mode: 'laptop', label: 'Laptop', widthLabel: '1024px', icon: Laptop },
  ];

  return (
    <div
      className="flex items-center gap-1.5 bg-muted/60 dark:bg-muted/30 border border-border rounded-xl p-1 shadow-2xs"
      data-testid="editor-device-toolbar"
    >
      <div className="flex items-center gap-1">
        {devices.map((d) => {
          const Icon = d.icon;
          const isActive = viewportMode === d.mode || (d.mode === 'laptop' && viewportMode === 'full');
          return (
            <button
              key={d.mode}
              type="button"
              title={`${d.label} (${d.widthLabel})`}
              onClick={() => setViewportMode(d.mode)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/80'
              )}
              data-testid={`device-btn-${d.mode}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{d.label}</span>
              <span className="hidden md:inline text-[9px] opacity-70 font-mono">({d.widthLabel})</span>
            </button>
          );
        })}
      </div>

      {onToggleCover && (
        <>
          <div className="h-4 w-px bg-border my-auto" />
          <button
            type="button"
            onClick={onToggleCover}
            title={isCoverOpen ? 'Tampilkan Layar Cover Pembuka' : 'Buka Layar Cover'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            data-testid="toggle-cover-simulation-btn"
          >
            {isCoverOpen ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-primary" />}
            <span className="hidden sm:inline text-[11px]">
              {isCoverOpen ? 'Uji Cover Pembuka' : 'Tutup Simulasi Cover'}
            </span>
          </button>
        </>
      )}
    </div>
  );
};
