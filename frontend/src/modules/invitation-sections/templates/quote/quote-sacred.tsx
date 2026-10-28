'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Sparkles } from 'lucide-react';

export const QuoteSacred: React.FC<SectionRenderProps<'quote'>> = ({
  content,
  copy,
}) => {
  const quote = content?.quote;

  return (
    <section
      data-testid="section-quote-sacred"
      className="relative w-full py-10 sm:py-16 md:py-20 px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-[100dvh] min-h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
      }}
    >
      <div className="max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto space-y-3 sm:space-y-5 relative">
        <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 text-[var(--inv-primary)] mx-auto shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>

        {copy?.title && (
          <h3 className="text-[11px] sm:text-sm uppercase tracking-[0.25em] font-semibold opacity-75 text-[var(--inv-primary)]">
            {copy.title}
          </h3>
        )}

        <p
          className="text-sm sm:text-lg md:text-xl italic leading-relaxed sm:leading-loose opacity-90 font-serif px-2 sm:px-6"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-font-body, #3A302C)',
          }}
        >
          &ldquo;{quote?.quoteText || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya...'}&rdquo;
        </p>

        {quote?.sourceText && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
            <div className="w-6 sm:w-12 h-px bg-gradient-to-r from-transparent to-[var(--inv-primary)]/40" />
            <p className="text-[11px] sm:text-sm font-medium tracking-widest uppercase text-[var(--inv-primary)]">
              {quote.sourceText}
            </p>
            <div className="w-6 sm:w-12 h-px bg-gradient-to-l from-transparent to-[var(--inv-primary)]/40" />
          </div>
        )}
      </div>
    </section>
  );
};
