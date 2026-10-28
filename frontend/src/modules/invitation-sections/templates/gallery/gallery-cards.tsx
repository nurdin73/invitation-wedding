'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Image as ImageIcon } from 'lucide-react';

export const GalleryCards: React.FC<SectionRenderProps<'gallery'>> = ({
  content,
  copy,
}) => {
  const images = (content?.gallery && content.gallery.length > 0) ? content.gallery : [];

  return (
    <section
      data-testid="section-gallery-cards"
      className="relative w-full py-16 sm:py-20 md:py-24 px-6 text-center space-y-8 flex flex-col justify-center items-center min-h-[100dvh] min-h-screen"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-2 max-w-sm sm:max-w-xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.title || 'Momen Bahagia'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-sm sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle || 'Galeri potret kenangan kebersamaan kami'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto pt-4">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-current/20 p-10 text-center opacity-60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--inv-primary)]" />
            <p className="text-xs sm:text-sm">Belum ada foto yang ditambahkan ke galeri kartu.</p>
          </div>
        ) : (
          <div className="inv-grid-2-cols gap-6 lg:gap-8">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="p-4 sm:p-5 bg-white/75 dark:bg-black/35 backdrop-blur-md rounded-3xl border border-[var(--inv-primary)]/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300 space-y-3"
              >
                <div className="aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-current/[0.04]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption || `Foto Card ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {img.caption && (
                  <p className="text-xs sm:text-sm font-medium text-center opacity-85 italic font-serif">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
