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
          : 'fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden',
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
      <div className="relative z-10 pt-6 sm:pt-10 space-y-1.5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 flex items-center justify-center text-[var(--inv-primary)] shadow-2xs">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </div>
        <p className="text-[11px] sm:text-sm uppercase tracking-[0.25em] font-semibold text-[var(--inv-primary)]">
          Walimatul Ursy
        </p>
      </div>

      {/* Center Section: Couple Title & Guest Personalized Card */}
      <div className="relative z-10 my-auto space-y-4 sm:space-y-6 max-w-xs sm:max-w-md mx-auto w-full">
        <div className="space-y-1">
          <p className="text-[11px] sm:text-sm uppercase tracking-[0.25em] opacity-75 font-medium">
            The Wedding Celebration of
          </p>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight"
            style={{
              fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
              color: 'var(--inv-primary, #B86B70)',
            }}
          >
            {coupleText}
          </h1>
        </div>

        {/* Personalized Guest Badge */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/75 dark:bg-black/35 backdrop-blur-md space-y-1.5 sm:space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm opacity-75">
            <Sparkles className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
            <span>Kepada Yth. Bapak/Ibu/Saudara/i:</span>
          </div>

          <h2
            className="text-base sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground truncate px-2"
            style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
            data-testid="cover-gate-guest-name"
          >
            {displayName}
          </h2>

          <p className="text-[10px] sm:text-xs opacity-60 leading-tight">
            Mohon maaf apabila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Action Button: Buka Undangan */}
        <div className="pt-1 sm:pt-2">
          <button
            type="button"
            onClick={onOpen}
            data-testid="cover-gate-open-btn"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[var(--inv-primary)]/20"
            style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
          >
            <MailOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Buka Undangan</span>
          </button>

          {isEditor && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 opacity-60">
              (Klik tombol di atas untuk mensimulasikan layar terbuka)
            </p>
          )}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="relative z-10 pb-4 sm:pb-6 text-[10px] sm:text-xs opacity-60 tracking-[0.2em] uppercase font-medium">
        Keluarga Besar Kedua Mempelai
      </div>
    </div>
  );
};
