import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Music, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LandingHero() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      data-testid="landing-hero-section"
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-tint blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN: Copywriting & Actions */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Pill Highlight Badge */}
            <div className="inline-flex items-center mb-5" data-testid="landing-hero-badge">
              <Badge
                variant="outline"
                className="rounded-full border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm"
              >
                Editor Undangan Pernikahan Online
              </Badge>
            </div>

            {/* Main H1 Headline */}
            <h1
              className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.15]"
              data-testid="landing-hero-title"
            >
              Buat dan Bagikan{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-serif italic font-normal text-primary">
                  Undangan Pernikahan
                </span>
                <span className="absolute bottom-1.5 left-0 -z-0 h-3 w-full bg-accent-tint rounded-sm" />
              </span>{' '}
              Digital
            </h1>

            {/* Subtitle */}
            <p
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
              data-testid="landing-hero-subtitle"
            >
              Pilih template elegan, atur susunan acara dan foto mempelai secara visual, lalu bagikan tautan undangan langsung ke keluarga dan teman Anda.
            </p>

            {/* CTA Cluster */}
            <div className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row items-center gap-3">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-7 shadow-sm gap-2"
                  data-testid="landing-hero-cta-primary"
                >
                  <span>Mulai Buat Undangan</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <a href="#features" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-7 gap-2"
                  data-testid="landing-hero-cta-secondary"
                >
                  <span>Jelajahi Fitur</span>
                </Button>
              </a>
            </div>

            {/* Feature Highlights */}
            <div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-muted-foreground"
              data-testid="landing-hero-feature-tags"
            >
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Konfirmasi Kehadiran</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Galeri Foto & Cerita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Peta Lokasi Google Maps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Amplop Digital & Rekening</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Mobile Chassis Wireframe Placeholder (Hidden on Mobile, Visible on Desktop lg:flex) */}
          <div
            className="relative hidden items-center justify-center lg:col-span-5 lg:flex"
            data-testid="landing-hero-mockup-col"
          >
            {/* Ambient Backlight Glow */}
            <div
              className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-accent-tint blur-2xl opacity-75"
              aria-hidden="true"
            />

            {/* Floating Live Badge Top Right */}
            <div
              className="absolute -top-3 -right-2 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 shadow-md"
              data-testid="landing-hero-mockup-badge-rsvp"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-semibold text-muted-caption tracking-wider">Kehadiran Tamu</span>
                <span className="text-xs font-semibold text-foreground">128 Tamu Konfirmasi</span>
              </div>
            </div>

            {/* Mobile Phone Mockup Chassis */}
            <div
              className="relative w-full max-w-[310px] rounded-[38px] border-[5px] border-border bg-card p-2.5 shadow-2xl ring-1 ring-border-soft"
              data-testid="landing-hero-phone-chassis"
            >
              {/* Dynamic Island / Speaker Pill */}
              <div className="mx-auto h-4 w-24 rounded-full bg-border/60 mb-2" />

              {/* Inner Screen Canvas Placeholder */}
              <div className="rounded-[28px] border border-border/80 bg-background p-5 text-center flex flex-col justify-between min-h-[440px]">
                {/* Header Subtitle */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-muted-caption font-semibold">
                    The Wedding Celebration
                  </span>
                  <div className="h-px w-8 mx-auto bg-border my-1" />
                </div>

                {/* Main Bride & Groom Monogram & Title */}
                <div className="my-auto py-6 space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-primary border border-border-soft shadow-inner">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif italic text-2xl text-foreground font-normal">
                    Sarah & Dimas
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                    Kami mengundang Anda untuk merayakan hari bahagia kami.
                  </p>
                </div>

                {/* Event Schedule Chip */}
                <div className="space-y-2">
                  <div className="rounded-xl border border-border bg-card p-2.5 text-left text-xs space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Sabtu, 28 November 2026</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                      <MapPin className="h-3.5 w-3.5 text-muted-caption" />
                      <span>Grand Ballroom Hotel, Jakarta</span>
                    </div>
                  </div>

                  {/* Simulated Guest Action Button */}
                  <div className="rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm">
                    Konfirmasi Kehadiran
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Music Badge Bottom Left */}
            <div
              className="absolute -bottom-3 -left-2 z-20 hidden sm:flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2 shadow-md"
              data-testid="landing-hero-mockup-badge-music"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-tint text-primary">
                <Music className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-semibold text-muted-caption uppercase tracking-wider">Musik Latar</span>
                <span className="text-xs font-medium text-foreground">A Thousand Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
