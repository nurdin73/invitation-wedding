'use client';

import * as React from 'react';
import type { SectionRenderProps, QuoteSectionData } from '../../types';
import { Sparkles } from 'lucide-react';

export const QuoteSacred: React.FC<SectionRenderProps<'quote'>> = ({ data }) => {
  const quote = data as QuoteSectionData;

  return (
    <section
      data-testid="section-quote-sacred"
      className="relative w-full py-12 px-6 text-center flex flex-col items-center justify-center min-h-[100dvh] min-h-screen"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
      }}
    >
      <div className="max-w-sm mx-auto space-y-3">
        <Sparkles className="w-4 h-4 mx-auto text-[var(--inv-primary)] opacity-70" />
        
        <p
          className="text-sm italic leading-relaxed opacity-90 font-serif px-4"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-font-body, #3A302C)',
          }}
        >
          &ldquo;{quote.quoteText || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}&rdquo;
        </p>

        <p className="text-[11px] font-semibold tracking-wider uppercase text-[var(--inv-primary)]">
          {quote.sourceText || 'QS. Ar-Rum: 21'}
        </p>
      </div>
    </section>
  );
};
