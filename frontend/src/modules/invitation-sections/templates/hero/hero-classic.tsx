'use client';

import * as React from 'react';
import type { SectionRenderProps, HeroSectionData } from '../../types';
import { Heart, Calendar } from 'lucide-react';
import { CountdownTimer } from '../../components/countdown-timer';

export const HeroClassic: React.FC<SectionRenderProps<'hero'>> = ({ data }) => {
  const hero = data as HeroSectionData;

  return (
    <section
      data-testid="section-hero-classic"
      className="relative w-full py-12 px-6 text-center flex flex-col items-center justify-center min-h-[100dvh] min-h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--inv-primary)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-sm mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-current/20 text-xs tracking-widest uppercase font-medium">
          <Heart className="w-3 h-3 text-[var(--inv-primary)] fill-current" />
          <span>{hero.subtitle || 'The Wedding Celebration'}</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-normal tracking-tight leading-tight"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {hero.groomName || 'Romeo'}
          <span className="block text-2xl my-1 opacity-70 font-light">&</span>
          {hero.brideName || 'Juliet'}
        </h1>

        {hero.weddingDate && (
          <div className="pt-2 flex items-center justify-center gap-2 text-xs opacity-80 tracking-wide font-medium">
            <Calendar className="w-3.5 h-3.5 text-[var(--inv-primary)]" />
            <span>{hero.weddingDate}</span>
          </div>
        )}

        {hero.welcomeNote && (
          <p className="pt-2 text-xs leading-relaxed max-w-xs mx-auto opacity-75">
            {hero.welcomeNote}
          </p>
        )}

        {/* Countdown Timer Menuju Hari H */}
        <CountdownTimer targetDate={hero.weddingDate} />
      </div>
    </section>
  );
};
