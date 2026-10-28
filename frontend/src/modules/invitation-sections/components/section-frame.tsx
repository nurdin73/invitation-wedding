'use client';

import * as React from 'react';
import type { SectionStyleConfig } from '../types';
import { cn } from '@/lib/utils';

// SVG Corner Ornament untuk gaya 'floral-corners'
const FloralCorner: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  position,
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-3 left-3';
      case 'top-right':
        return 'top-3 right-3';
      case 'bottom-left':
        return 'bottom-3 left-3';
      case 'bottom-right':
        return 'bottom-3 right-3';
    }
  };

  return (
    <div
      className={cn('absolute w-10 h-10 pointer-events-none z-10 opacity-70', getPositionClasses())}
      style={{ transform: getTransform() }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full text-[var(--inv-primary,#B86B70)]">
        <path
          d="M2 38V12C2 6.47715 6.47715 2 12 2H38"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M8 38V16C8 11.5817 11.5817 8 16 8H38"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <path
          d="M12 14.5C12 18 16 20 19 19C20 16 18 12 14.5 12"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
};

interface SectionFrameProps {
  styleConfig?: SectionStyleConfig;
  className?: string;
  children: React.ReactNode;
}

export const SectionFrame: React.FC<SectionFrameProps> = ({
  styleConfig,
  className,
  children,
}) => {
  const hasBgImage = Boolean(styleConfig?.backgroundImageUrl);
  const overlayOpacity = (styleConfig?.backgroundOverlayOpacity ?? 40) / 100;
  const frameStyle = styleConfig?.frameStyle || 'none';

  return (
    <div
      className={cn(
        'relative w-full min-h-[100dvh] min-h-screen flex flex-col justify-center overflow-hidden transition-all duration-300',
        className
      )}
      style={
        hasBgImage
          ? ({
              '--inv-bg': 'transparent',
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* 1. Background Image Backdrop */}
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url(${styleConfig?.backgroundImageUrl})`,
            }}
          />
          {/* Readability Contrast Overlay */}
          <div
            className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* 2. Frame Styles / Ornaments */}
      {frameStyle === 'classic-border' && (
        <div
          className="absolute inset-3.5 sm:inset-5 rounded-2xl border border-[var(--inv-primary,#B86B70)]/35 pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-1 rounded-xl border border-[var(--inv-primary,#B86B70)]/15" />
        </div>
      )}

      {frameStyle === 'floral-corners' && (
        <>
          <FloralCorner position="top-left" />
          <FloralCorner position="top-right" />
          <FloralCorner position="bottom-left" />
          <FloralCorner position="bottom-right" />
        </>
      )}

      {frameStyle === 'card-box' && (
        <div
          className="absolute inset-3 sm:inset-4 rounded-3xl border border-[var(--inv-primary,#B86B70)]/25 bg-[var(--inv-canvas-bg,#FAF8F5)]/70 backdrop-blur-xs shadow-sm pointer-events-none z-0"
          aria-hidden="true"
        />
      )}

      {frameStyle === 'arch-window' && (
        <div
          className="absolute inset-3 sm:inset-4 rounded-t-[120px] rounded-b-2xl border-2 border-b border-[var(--inv-primary,#B86B70)]/30 pointer-events-none z-10"
          aria-hidden="true"
        />
      )}

      {/* 3. Section Content Node */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">{children}</div>
    </div>
  );
};
