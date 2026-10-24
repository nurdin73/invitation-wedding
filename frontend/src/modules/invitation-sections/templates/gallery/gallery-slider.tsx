'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySlider: React.FC<SectionRenderProps<'gallery'>> = ({
  content,
  copy,
}) => {
  const images = (content?.gallery && content.gallery.length > 0) ? content.gallery : [];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      data-testid="section-gallery-slider"
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

      <div className="w-full max-w-sm mx-auto">
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-current/20 p-8 text-center opacity-60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--inv-primary)]" />
            <p className="text-xs">Belum ada foto yang ditambahkan ke galeri slider.</p>
          </div>
        ) : (
          <div className="relative space-y-3">
            {/* Main Featured Slide */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-current/10 bg-current/[0.04] shadow-md group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.caption || `Foto Slider ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 ease-out"
              />

              {/* Prev & Next Floating Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Foto Sebelumnya"
                    data-testid="gallery-slider-prev-btn"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Foto Selanjutnya"
                    data-testid="gallery-slider-next-btn"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Caption Overlay */}
              {images[currentIndex]?.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white text-left">
                  <p className="text-xs font-medium tracking-wide">
                    {images[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Dots Pagination Indicators */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-[var(--inv-primary)]'
                        : 'w-1.5 bg-current/25 hover:bg-current/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
