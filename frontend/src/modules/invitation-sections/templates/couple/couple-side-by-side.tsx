'use client';

import * as React from 'react';
import type { SectionRenderProps } from '../../types';
import { User } from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const CoupleSideBySide: React.FC<SectionRenderProps<'couple'>> = ({
  content,
  copy,
  isEditor,
}) => {
  const groom = content?.couple?.groom;
  const bride = content?.couple?.bride;

  const groomName = groom?.fullName || groom?.nickname || (isEditor ? 'Nama Lengkap Pria' : '');
  const brideName = bride?.fullName || bride?.nickname || (isEditor ? 'Nama Lengkap Wanita' : '');
  const groomParents = groom?.parents || (isEditor ? 'Putra tercinta dari Bpk. ... & Ibu ...' : '');
  const brideParents = bride?.parents || (isEditor ? 'Putri tercinta dari Bpk. ... & Ibu ...' : '');

  return (
    <section
      data-testid="section-couple-side-by-side"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 sm:space-y-8 flex flex-col justify-center items-center min-h-[100dvh] min-h-screen overflow-hidden"
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
          {copy?.title || 'Mempelai Pengantin'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle ||
            'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengumumkan pernikahan putra-putri kami:'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="relative grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 max-w-sm sm:max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto w-full pt-2 sm:pt-4">
        {/* Floating Centered Romantic Ampersand Badge */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-[var(--inv-primary)]/30 bg-white/95 dark:bg-black/80 backdrop-blur-md shadow-md flex items-center justify-center text-xs sm:text-2xl md:text-3xl font-light italic text-[var(--inv-primary)] pointer-events-none select-none"
          style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
        >
          &
        </div>

        {/* Groom Profile */}
        <div className="w-full relative p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300 space-y-2 sm:space-y-4">
          <div className="text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[var(--inv-primary)] opacity-85">
            The Groom
          </div>

          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto rounded-full p-1 sm:p-1.5 border border-[var(--inv-primary)]/30 ring-2 sm:ring-4 ring-[var(--inv-primary)]/10 bg-current/[0.03] transition-transform duration-300 hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-current/[0.05]">
              {groom?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={groom.photoUrl}
                  alt={groomName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 sm:w-10 sm:h-10 text-[var(--inv-primary)] opacity-60" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3
              className="text-sm sm:text-xl md:text-2xl font-medium tracking-tight truncate"
              style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
            >
              {groomName}
            </h3>
            {groomParents && (
              <p className="text-[10px] sm:text-xs md:text-sm opacity-80 leading-tight sm:leading-relaxed max-w-xs mx-auto line-clamp-3 sm:line-clamp-none">
                {groomParents}
              </p>
            )}
          </div>

          {groom?.instagram && (
            <div className="pt-1 sm:pt-2">
              <a
                href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 text-[var(--inv-primary)] hover:bg-[var(--inv-primary)] hover:text-white transition-all duration-200"
              >
                <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">@{groom.instagram.replace('@', '')}</span>
              </a>
            </div>
          )}
        </div>

        {/* Bride Profile */}
        <div className="w-full relative p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300 space-y-2 sm:space-y-4">
          <div className="text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[var(--inv-primary)] opacity-85">
            The Bride
          </div>

          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto rounded-full p-1 sm:p-1.5 border border-[var(--inv-primary)]/30 ring-2 sm:ring-4 ring-[var(--inv-primary)]/10 bg-current/[0.03] transition-transform duration-300 hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-current/[0.05]">
              {bride?.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bride.photoUrl}
                  alt={brideName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 sm:w-10 sm:h-10 text-[var(--inv-primary)] opacity-60" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3
              className="text-sm sm:text-xl md:text-2xl font-medium tracking-tight truncate"
              style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
            >
              {brideName}
            </h3>
            {brideParents && (
              <p className="text-[10px] sm:text-xs md:text-sm opacity-80 leading-tight sm:leading-relaxed max-w-xs mx-auto line-clamp-3 sm:line-clamp-none">
                {brideParents}
              </p>
            )}
          </div>

          {bride?.instagram && (
            <div className="pt-1 sm:pt-2">
              <a
                href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border border-[var(--inv-primary)]/30 bg-[var(--inv-primary)]/5 text-[var(--inv-primary)] hover:bg-[var(--inv-primary)] hover:text-white transition-all duration-200"
              >
                <InstagramIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate max-w-[80px] sm:max-w-none">@{bride.instagram.replace('@', '')}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
