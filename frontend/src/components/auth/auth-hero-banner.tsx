'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface HeroQuote {
  tagline: string;
  headline: string;
}

const getQuoteForPath = (pathname: string): HeroQuote => {
  if (pathname.includes('/register')) {
    return {
      tagline: 'Mulai Lebih Mudah',
      headline: 'Wujudkan undangan pernikahan impian Anda dengan keanggunan dan kemudahan.',
    };
  }
  if (pathname.includes('/forgot-password') || pathname.includes('/reset-password')) {
    return {
      tagline: 'Pemulihan Akun',
      headline: 'Akses kembali akun Anda dan lanjutkan persiapan momen bahagia.',
    };
  }
  return {
    tagline: 'Platform Undangan Pernikahan',
    headline: 'Kelola momen bahagia dan bagikan kehangatan bersama orang tercinta.',
  };
};

export const AuthHeroBanner: React.FC = () => {
  const pathname = usePathname();
  const quote = getQuoteForPath(pathname);

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden p-8 sm:p-12 md:p-10 lg:p-14 xl:p-16 text-white h-full min-h-[380px] md:min-h-screen transition-all"
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(242, 223, 220, 0.35) 0%, transparent 45%),
          radial-gradient(circle at 85% 20%, rgba(223, 177, 91, 0.3) 0%, transparent 45%),
          radial-gradient(circle at 80% 80%, rgba(184, 107, 112, 0.45) 0%, transparent 55%),
          radial-gradient(circle at 20% 85%, rgba(115, 99, 92, 0.4) 0%, transparent 50%),
          linear-gradient(145deg, #2b1f1d 0%, #3a2b27 35%, #543936 70%, #704746 100%)
        `,
      }}
      data-testid="auth-hero-banner"
    >
      {/* Decorative warm aura glow elements matching wedding palette */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-accent-gold/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-[#DFB15B]/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Top Header: Brand Logo (Left) and Heart / Love Icon (Right) */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Brand Logo - Matching LandingNavbar */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-95"
          data-testid="auth-hero-brand-link"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-sans text-xl font-bold tracking-tight text-white drop-shadow-sm">
            {siteConfig.name}
          </span>
        </Link>

        {/* Elegant Love / Heart Icon Badge in Top-Right Corner */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner transition-transform hover:scale-105"
          aria-label="Cinta & Kasih Sayang"
          data-testid="auth-hero-heart-badge"
        >
          <Heart className="h-5 w-5 fill-accent-tint text-accent-tint stroke-[2.2]" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom Quote & Tagline */}
      <div className="relative z-10 mt-16 md:mt-auto space-y-3 pt-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" aria-hidden="true" />
          <span>{quote.tagline}</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight text-white drop-shadow-sm max-w-lg">
          {quote.headline}
        </h2>
      </div>
    </div>
  );
};

AuthHeroBanner.displayName = 'AuthHeroBanner';
