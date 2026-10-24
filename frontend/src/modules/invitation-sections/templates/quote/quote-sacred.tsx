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
      className="relative w-full py-16 px-6 text-center flex flex-col items-center justify-center min-h-[60vh]"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
      }}
    >
      <div className="max-w-sm mx-auto space-y-3">
        <Sparkles className="w-4 h-4 mx-auto text-[var(--inv-primary)] opacity-70" />

        {copy?.title && (
          <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60 text-[var(--inv-primary)]">
            {copy.title}
          </h3>
        )}

        <p
          className="text-sm italic leading-relaxed opacity-90 font-serif px-4"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-font-body, #3A302C)',
          }}
        >
          &ldquo;{quote?.quoteText || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...'}&rdquo;
        </p>

        {quote?.sourceText && (
          <p className="text-[11px] font-semibold tracking-wider uppercase text-[var(--inv-primary)]">
            {quote.sourceText}
          </p>
        )}
      </div>
    </section>
  );
};
