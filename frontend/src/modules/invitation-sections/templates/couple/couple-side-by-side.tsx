'use client';

import * as React from 'react';
import type { SectionRenderProps, CoupleSectionData } from '../../types';
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

export const CoupleSideBySide: React.FC<SectionRenderProps<'couple'>> = ({ data }) => {
  const couple = data as CoupleSectionData;

  return (
    <section
      data-testid="section-couple-side-by-side"
      className="relative w-full py-12 px-6 text-center space-y-8"
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
          {couple.title || 'Mempelai Pengantin'}
        </h2>
        <p className="text-xs opacity-70">
          {couple.subtitle || 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengumumkan pernikahan putra-putri kami:'}
        </p>
      </div>

      <div className="space-y-6 max-w-sm mx-auto">
        {/* Groom Profile */}
        <div className="space-y-2 p-4 rounded-2xl border border-current/10 bg-current/[0.02]">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-[var(--inv-primary)] overflow-hidden flex items-center justify-center bg-current/[0.05]">
            {couple.groomPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={couple.groomPhotoUrl}
                alt={couple.groomFullName || 'Mempelai Pria'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[var(--inv-primary)] opacity-60" />
            )}
          </div>
          <h3
            className="text-lg font-medium"
            style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
          >
            {couple.groomFullName || 'Nama Lengkap Pria'}
          </h3>
          <p className="text-xs opacity-80 leading-relaxed">
            {couple.groomParents || 'Putra dari Bpk. Fulan & Ibu Fulanah'}
          </p>
          {couple.groomInstagram && (
            <div className="inline-flex items-center gap-1 text-[11px] text-[var(--inv-primary)] font-medium">
              <InstagramIcon className="w-3 h-3" />
              <span>@{couple.groomInstagram.replace('@', '')}</span>
            </div>
          )}
        </div>

        <div
          className="text-2xl font-light opacity-50"
          style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
        >
          &
        </div>

        {/* Bride Profile */}
        <div className="space-y-2 p-4 rounded-2xl border border-current/10 bg-current/[0.02]">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-[var(--inv-primary)] overflow-hidden flex items-center justify-center bg-current/[0.05]">
            {couple.bridePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={couple.bridePhotoUrl}
                alt={couple.brideFullName || 'Mempelai Wanita'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[var(--inv-primary)] opacity-60" />
            )}
          </div>
          <h3
            className="text-lg font-medium"
            style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
          >
            {couple.brideFullName || 'Nama Lengkap Wanita'}
          </h3>
          <p className="text-xs opacity-80 leading-relaxed">
            {couple.brideParents || 'Putri dari Bpk. Fulan & Ibu Fulanah'}
          </p>
          {couple.brideInstagram && (
            <div className="inline-flex items-center gap-1 text-[11px] text-[var(--inv-primary)] font-medium">
              <InstagramIcon className="w-3 h-3" />
              <span>@{couple.brideInstagram.replace('@', '')}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
