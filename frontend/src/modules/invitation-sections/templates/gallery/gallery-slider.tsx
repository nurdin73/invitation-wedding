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

      <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl mx-auto pt-4">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-current/20 p-10 text-center opacity-60">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--inv-primary)]" />
            <p className="text-xs sm:text-sm">Belum ada foto yang ditambahkan ke galeri slider.</p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {/* Main Featured Slide */}
            <div className="relative aspect-[4/5] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--inv-primary)]/20 bg-current/[0.04] shadow-[0_12px_40px_rgb(0,0,0,0.08)] group">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 hover:scale-105 shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Foto Selanjutnya"
                    data-testid="gallery-slider-next-btn"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 hover:scale-105 shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Caption Overlay */}
              {images[currentIndex]?.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 sm:p-6 text-white text-left">
                  <p className="text-xs sm:text-sm font-medium tracking-wide font-serif italic">
                    {images[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Dots Pagination Indicators */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-[var(--inv-primary)]'
                        : 'w-2 bg-current/25 hover:bg-current/50'
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
