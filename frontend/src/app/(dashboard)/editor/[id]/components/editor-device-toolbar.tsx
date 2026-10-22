'use client';

import * as React from 'react';
import { Smartphone, Tablet, Monitor, Eye, EyeOff } from 'lucide-react';
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

  const devices: { mode: ViewportMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'mobile', label: 'Ponsel (390px)', icon: Smartphone },
    { mode: 'tablet', label: 'Tablet (640px)', icon: Tablet },
    { mode: 'full', label: 'Layar Penuh', icon: Monitor },
  ];

  return (
    <div
      className="flex items-center gap-1.5 bg-card/95 backdrop-blur-xs border border-border rounded-xl p-1 shadow-md"
      data-testid="editor-device-toolbar"
    >
      <div className="flex items-center gap-1">
        {devices.map((d) => {
          const Icon = d.icon;
          const isActive = viewportMode === d.mode;
          return (
            <button
              key={d.mode}
              type="button"
              title={d.label}
              onClick={() => setViewportMode(d.mode)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              data-testid={`device-btn-${d.mode}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{d.label}</span>
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
