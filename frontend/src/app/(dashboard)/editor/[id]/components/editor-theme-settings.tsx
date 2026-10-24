'use client';

import * as React from 'react';
import { Palette, Type } from 'lucide-react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import {
  THEME_PALETTES,
  FONT_OPTIONS_HEADING,
  FONT_OPTIONS_BODY,
} from '@/lib/style-helpers';
import { TemplatePicker } from './design/template-picker';

export const EditorThemeSettings: React.FC = () => {
  const themeConfig = useInvitationEditorStore((s) => s.themeConfig);
  const updateThemeConfig = useInvitationEditorStore((s) => s.updateThemeConfig);

  const handleSelectPalette = (paletteId: string) => {
    const selected = THEME_PALETTES.find((p) => p.id === paletteId);
    if (!selected) return;

    updateThemeConfig({
      paletteId: selected.id,
      primaryColor: selected.primaryColor,
      secondaryColor: selected.secondaryColor,
      canvasBackground: selected.canvasBackground,
    });
  };

  return (
    <div className="space-y-6 text-xs" data-testid="editor-theme-settings">
      {/* 1. Pemilihan Template Siap Pakai */}
      <TemplatePicker />

      {/* 2. Palet Warna Terkurasi */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span>Kustomisasi Palet Warna</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {THEME_PALETTES.map((p) => {
            const isSelected = themeConfig.paletteId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPalette(p.id)}
                className={`p-3 rounded-xl border text-left space-y-2 transition-all ${
                  isSelected
                    ? 'border-primary ring-1 ring-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
                data-testid={`theme-palette-${p.id}`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: p.primaryColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: p.secondaryColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs shrink-0"
                    style={{ backgroundColor: p.canvasBackground }}
                  />
                </div>
                <div>
                  <h5 className="font-medium text-xs leading-none text-foreground">{p.name}</h5>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tipografi Editorial */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-primary" />
          <span>Tipografi Huruf</span>
        </label>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Font Judul (Heading)
            </label>
            <select
              value={themeConfig.headingFont}
              onChange={(e) => updateThemeConfig({ headingFont: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {FONT_OPTIONS_HEADING.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium mb-1 text-muted-foreground">
              Font Teks Konten (Body)
            </label>
            <select
              value={themeConfig.bodyFont}
              onChange={(e) => updateThemeConfig({ bodyFont: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {FONT_OPTIONS_BODY.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
