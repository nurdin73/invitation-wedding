'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Heart, Calendar } from 'lucide-react';
import { CountdownTimer } from '../../components/countdown-timer';
import {
  getMainWeddingDate,
  getMainWeddingISODate,
  getCoupleDisplayNames,
} from '../../content-format.utils';

export const HeroClassic: React.FC<SectionRenderProps<'hero'>> = ({
  content,
  copy,
  isEditor,
}) => {
  const { groom, bride } = getCoupleDisplayNames(content?.couple);
  const displayGroom = groom || (isEditor ? 'Nama Mempelai Pria' : '');
  const displayBride = bride || (isEditor ? 'Nama Mempelai Wanita' : '');
  const formattedDate = getMainWeddingDate(content?.events);
  const isoDate = getMainWeddingISODate(content?.events);

  return (
    <section
      data-testid="section-hero-classic"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-[100dvh] min-h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--inv-primary)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-sm sm:max-w-xl md:max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 text-[11px] sm:text-sm tracking-[0.2em] uppercase font-medium text-[var(--inv-primary)] shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-[var(--inv-primary)] fill-current" />
          <span>{copy?.subtitle || 'The Wedding Celebration'}</span>
        </div>

        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-tight px-2"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          <span>{displayGroom}</span>
          <span className="inline-block mx-2 sm:mx-3 text-2xl sm:text-4xl md:text-5xl opacity-60 font-light italic font-serif">
            &
          </span>
          <span>{displayBride}</span>
        </h1>

        {formattedDate && (
          <div className="pt-1 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border border-current/15 bg-white/40 dark:bg-black/20 backdrop-blur-xs text-[11px] sm:text-sm opacity-90 tracking-widest uppercase font-medium">
              <Calendar className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        )}

        {copy?.welcomeNote && (
          <p className="text-xs sm:text-sm md:text-base leading-relaxed max-w-xs sm:max-w-lg mx-auto opacity-80 pt-1">
            {copy.welcomeNote}
          </p>
        )}

        <div className="w-20 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto" />

        {/* Countdown Timer Menuju Hari H */}
        <CountdownTimer targetDate={isoDate} />
      </div>
    </section>
  );
};
