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
      className="relative w-full py-16 px-6 text-center space-y-6 flex flex-col justify-center items-center min-h-[60vh]"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-1">
        <h2
          className="text-2xl font-normal"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.title || 'Momen Bahagia'}
        </h2>
        <p className="text-xs opacity-70 max-w-sm mx-auto">
          {copy?.subtitle || 'Galeri potret kenangan kebersamaan kami'}
        </p>
      </div>

      <div className="max-w-sm mx-auto w-full">
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-current/20 p-8 text-center opacity-60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--inv-primary)]" />
            <p className="text-xs">Belum ada foto yang ditambahkan ke galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="aspect-square rounded-xl overflow-hidden border border-current/10 bg-current/[0.04] relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || `Foto Galeri ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
