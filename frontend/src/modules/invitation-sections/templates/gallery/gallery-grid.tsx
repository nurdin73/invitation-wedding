'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Image as ImageIcon } from 'lucide-react';

export const GalleryGrid: React.FC<SectionRenderProps<'gallery'>> = ({
  content,
  copy,
}) => {
  const images = (content?.gallery && content.gallery.length > 0) ? content.gallery : [];

  return (
    <section
      data-testid="section-gallery-grid"
      className="relative w-full py-16 sm:py-20 md:py-24 px-6 text-center space-y-8 flex flex-col justify-center items-center min-h-[60vh]"
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

      <div className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto w-full pt-4">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-current/20 p-10 text-center opacity-60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--inv-primary)]" />
            <p className="text-xs sm:text-sm">Belum ada foto yang ditambahkan ke galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--inv-primary)]/20 bg-current/[0.04] shadow-xs hover:shadow-md relative group cursor-pointer transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || `Foto Galeri ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs truncate font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
