'use client';

import * as React from 'react';
import { MailOpen, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeConfig } from './types';

interface CoverGateOverlayProps {
  isOpen: boolean;
  onOpen: () => void;
  title: string;
  groomName?: string;
  brideName?: string;
  guestName?: string;
  themeConfig?: ThemeConfig;
  isEditor?: boolean;
}

export const CoverGateOverlay: React.FC<CoverGateOverlayProps> = ({
  isOpen,
  onOpen,
  title,
  groomName,
  brideName,
  guestName,
  isEditor,
}) => {
  const coupleText = groomName && brideName ? `${groomName} & ${brideName}` : title;
  const displayName = guestName?.trim() || 'Tamu Undangan';

  return (
    <div
      data-testid="cover-gate-overlay"
      className={cn(
        'z-40 flex flex-col items-center justify-between p-6 text-center transition-all duration-700 ease-in-out',
        isEditor
          ? 'absolute inset-0 h-full max-h-full overflow-hidden'
          : 'fixed inset-0 sm:max-w-md sm:mx-auto h-[100dvh] max-h-[100dvh] overflow-hidden',
        isOpen
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      )}
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--inv-primary)_0%,_transparent_75%)]" />

      {/* Top Section: Monogram & Subtitle */}
      <div className="relative z-10 pt-8 space-y-2">
        <div className="w-10 h-10 mx-auto rounded-full border border-current/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-[var(--inv-primary)] fill-current" />
        </div>
        <p className="text-[11px] uppercase tracking-widest font-medium opacity-75">
          Walimatul Ursy
        </p>
      </div>

      {/* Center Section: Couple Title & Guest Personalized Card */}
      <div className="relative z-10 my-auto space-y-6 max-w-xs mx-auto w-full">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest opacity-70">
            The Wedding Celebration of
          </p>
          <h1
            className="text-3xl sm:text-4xl font-normal tracking-tight leading-tight"
            style={{
              fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
              color: 'var(--inv-primary, #B86B70)',
            }}
          >
            {coupleText}
          </h1>
        </div>

        {/* Personalized Guest Badge */}
        <div className="p-4 rounded-2xl border border-current/15 bg-current/[0.025] backdrop-blur-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-70">
            <Sparkles className="w-3 h-3 text-[var(--inv-primary)]" />
            <span>Kepada Yth. Bapak/Ibu/Saudara/i:</span>
          </div>

          <h2
            className="text-lg font-semibold tracking-tight text-foreground truncate px-2"
            style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
            data-testid="cover-gate-guest-name"
          >
            {displayName}
          </h2>

          <p className="text-[10px] opacity-60 leading-tight">
            Mohon maaf apabila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Action Button: Buka Undangan */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpen}
            data-testid="cover-gate-open-btn"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
          >
            <MailOpen className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Buka Undangan</span>
          </button>

          {isEditor && (
            <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
              (Klik tombol di atas untuk mensimulasikan layar terbuka)
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pb-4 text-[10px] opacity-50 tracking-wider uppercase font-medium">
        Keluarga Besar Kedua Mempelai
      </div>
    </div>
  );
};
