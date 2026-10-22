'use client';

import * as React from 'react';
import type { SectionRenderProps, FooterSectionData } from '../../types';
import { Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const FooterClosing: React.FC<SectionRenderProps<'footer'>> = ({ data }) => {
  const footer = data as FooterSectionData;

  return (
    <footer
      data-testid="section-footer-closing"
      className="relative w-full py-16 px-6 text-center space-y-4"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="max-w-xs mx-auto space-y-2">
        <Heart className="w-4 h-4 mx-auto text-[var(--inv-primary)] fill-current opacity-80" />
        <h3
          className="text-lg font-medium"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {footer.closingText || 'Terima Kasih'}
        </h3>
        <p className="text-xs opacity-75 leading-relaxed">
          {footer.thankYouNote || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.'}
        </p>
      </div>

      <div className="pt-6 border-t border-current/10 text-[10px] opacity-50 tracking-wider uppercase font-medium">
        Dibuat dengan cinta via {siteConfig.name}
      </div>
    </footer>
  );
};
