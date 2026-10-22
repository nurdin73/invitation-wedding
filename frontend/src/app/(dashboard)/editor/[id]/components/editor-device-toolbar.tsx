'use client';

import * as React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useInvitationEditorStore, type ViewportMode } from '@/lib/stores/invitation-editor.store';
import { cn } from '@/lib/utils';

export const EditorDeviceToolbar: React.FC = () => {
  const viewportMode = useInvitationEditorStore((s) => s.viewportMode);
  const setViewportMode = useInvitationEditorStore((s) => s.setViewportMode);

  const devices: { mode: ViewportMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'mobile', label: 'Ponsel (390px)', icon: Smartphone },
    { mode: 'tablet', label: 'Tablet (640px)', icon: Tablet },
    { mode: 'full', label: 'Layar Penuh', icon: Monitor },
  ];

  return (
    <div
      className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-xs"
      data-testid="editor-device-toolbar"
    >
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
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors',
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
  );
};
