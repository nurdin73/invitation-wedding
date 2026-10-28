'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const FooterClosing: React.FC<SectionRenderProps<'footer'>> = ({
  copy,
}) => {
  return (
    <footer
      data-testid="section-footer-closing"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 flex flex-col justify-center items-center min-h-[100dvh] min-h-screen"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="max-w-xs sm:max-w-md mx-auto space-y-3 sm:space-y-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 mx-auto rounded-full border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 flex items-center justify-center text-[var(--inv-primary)] shadow-2xs">
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <h3
          className="text-xl sm:text-3xl font-normal tracking-tight"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.closingText || 'Terima Kasih'}
        </h3>
        <p className="text-xs sm:text-sm md:text-base opacity-80 leading-relaxed max-w-xs sm:max-w-md mx-auto">
          {copy?.thankYouNote ||
            'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="pt-6 sm:pt-8 border-t border-current/10 text-[10px] sm:text-xs opacity-60 tracking-[0.2em] uppercase font-medium">
        Dibuat dengan cinta via {siteConfig.name}
      </div>
    </footer>
  );
};
