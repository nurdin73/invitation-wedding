'use client';

import * as React from 'react';
import { Palette, Type } from 'lucide-react';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import {
  THEME_PALETTES,
  FONT_OPTIONS_HEADING,
  FONT_OPTIONS_BODY,
} from '@/lib/style-helpers';

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
      <div>
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
          Tema & Estetika Undangan
        </h3>
        <p className="text-[11px] text-muted-foreground">
          Atur skema warna dasar, font editorial, dan visual kanvas.
        </p>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-3">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <span>Palet Warna Terkurasi</span>
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
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: p.primaryColor }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: p.canvasBackground }}
                  />
                </div>
                <p className="font-medium text-[11px] text-foreground leading-tight">
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Codes */}
      <div className="space-y-3 pt-2 border-t border-border">
        <label className="font-semibold text-foreground block">
          Kustomisasi Warna Hex
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="block text-[11px] text-muted-foreground mb-1">
              Warna Utama (Aksen)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeConfig.primaryColor || '#B86B70'}
                onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={themeConfig.primaryColor || '#B86B70'}
                onChange={(e) => updateThemeConfig({ primaryColor: e.target.value })}
                className="w-full rounded border border-input bg-background px-2 py-1 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-muted-foreground mb-1">
              Latar Belakang Kanvas
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeConfig.canvasBackground || '#FAF8F5'}
                onChange={(e) => updateThemeConfig({ canvasBackground: e.target.value })}
                className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={themeConfig.canvasBackground || '#FAF8F5'}
                onChange={(e) => updateThemeConfig({ canvasBackground: e.target.value })}
                className="w-full rounded border border-input bg-background px-2 py-1 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Pairing */}
      <div className="space-y-3 pt-2 border-t border-border">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-primary" />
          <span>Pasangan Tipografi</span>
        </label>

        <div>
          <span className="block text-[11px] text-muted-foreground mb-1">
            Font Judul & Header (Serif / Editorial)
          </span>
          <select
            value={themeConfig.headingFont || 'Playfair Display, serif'}
            onChange={(e) => updateThemeConfig({ headingFont: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {FONT_OPTIONS_HEADING.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-[11px] text-muted-foreground mb-1">
            Font Teks Isi (Body / Sans)
          </span>
          <select
            value={themeConfig.bodyFont || 'Plus Jakarta Sans, sans-serif'}
            onChange={(e) => updateThemeConfig({ bodyFont: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
  );
};
