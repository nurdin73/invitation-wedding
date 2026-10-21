'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Heart, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { TestimonialItem } from './landing.types';

const DEFAULT_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 'testi-1',
    names: 'Dimas & Sarah',
    location: 'Jakarta Selatan',
    date: 'Menikah Mei 2026',
    templateName: 'Minimalist Elegance',
    rating: 5,
    quote:
      'Sangat praktis saat ada perubahan jam akad nikah yang mendadak. Cukup edit dari dashboard dalam dua menit, seluruh tamu yang memegang tautan undangan otomatis melihat jadwal yang baru tanpa perlu kami hubungi satu per satu.',
  },
  {
    id: 'testi-2',
    names: 'Reza & Nabila',
    location: 'Bandung',
    date: 'Menikah Juli 2026',
    templateName: 'Floral Botanica',
    rating: 5,
    quote:
      'Fitur konfirmasi kehadiran sangat membantu kami memperkirakan jumlah porsi katering dengan akurat. Kerabat dan tamu kami juga memuji tampilan undangannya yang elegan, cepat terbuka, dan tidak berat diakses di ponsel.',
  },
  {
    id: 'testi-3',
    names: 'Fajar & Anisa',
    location: 'Yogyakarta',
    date: 'Menikah September 2026',
    templateName: 'Nusantara Heritage',
    rating: 5,
    quote:
      'Bagi kerabat luar kota yang berhalangan hadir langsung, fitur amplop digital dan ucapan doa sangat memudahkan mereka untuk tetap mengirimkan tanda kasih dan pesan kebahagiaan untuk kami berdua.',
  },
  {
    id: 'testi-4',
    names: 'Aldi & Vina',
    location: 'Surabaya',
    date: 'Menikah Oktober 2026',
    templateName: 'Modern Luxury',
    rating: 5,
    quote:
      'Integrasi Google Maps langsung memandu tamu ke venue gedung tanpa tersesat. Desain visualnya juga terlihat sangat premium dan tidak terlihat murahan sama sekali.',
  },
  {
    id: 'testi-5',
    names: 'Ilham & Putri',
    location: 'Medan',
    date: 'Menikah Desember 2026',
    templateName: 'Royale Monogram',
    rating: 5,
    quote:
      'Proses memasukkan daftar tamu dengan nama khusus sangat cepat. Musik latarnya juga berjalan otomatis dan membuat suasana saat membuka undangan terasa sangat khidmat.',
  },
];

export interface LandingTestimonialsProps {
  /**
   * Data ulasan pengantin (dapat dihubungkan langsung ke database atau API).
   * Default: DEFAULT_TESTIMONIALS.
   */
  readonly testimonials?: readonly TestimonialItem[];

  /**
   * Kontrol visibilitas tombol navigasi panah Previous dan Next.
   * True: tombol panah muncul di sisi slider.
   * False: tombol panah disembunyikan.
   * Default: true.
   */
  readonly showControls?: boolean;

  /**
   * Kontrol visibilitas indikator titik (dot indicators) di bawah slider.
   * Default: true.
   */
  readonly showDots?: boolean;

  /**
   * Apakah slider berputar terus menerus tanpa batas (infinite loop).
   * Default: true.
   */
  readonly loop?: boolean;

  /**
   * Mengaktifkan pergantian slide otomatis (auto-scroll).
   * Default: true.
   */
  readonly autoScroll?: boolean;

  /**
   * Durasi pergantian slide otomatis dalam milidetik.
   * Default: 4000 (4 detik).
   */
  readonly autoScrollInterval?: number;
}

export function LandingTestimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  showControls = true,
  showDots = true,
  loop = true,
  autoScroll = true,
  autoScrollInterval = 4000,
}: LandingTestimonialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: autoScrollInterval,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const plugins = React.useMemo(() => {
    return autoScroll ? [autoplayPlugin.current] : [];
  }, [autoScroll]);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Helper to extract initials (e.g. "Dimas & Sarah" -> "D & S")
  const getMonogram = (names: string): string => {
    const parts = names.split('&').map((p) => p.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0)} & ${parts[1].charAt(0)}`;
    }
    return names.slice(0, 2).toUpperCase();
  };

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-28 bg-background border-t border-border overflow-hidden"
      data-testid="landing-testimonials-section"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge
            variant="secondary"
            className="gap-1.5 px-3.5 py-1 text-xs font-medium border-border-soft bg-accent-tint text-primary"
            data-testid="landing-testimonials-badge"
          >
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Cerita Pengantin</span>
          </Badge>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground font-serif"
            data-testid="landing-testimonials-title"
          >
            Momen Bahagia Bersama Plannikah
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid="landing-testimonials-subtitle"
          >
            Kisah pengalaman nyata pasangan mempelai yang mempercayakan kemudahan undangan pernikahan mereka bersama kami.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="mt-14 relative px-2 sm:px-4">
          <Carousel
            setApi={setApi}
            plugins={plugins}
            opts={{
              align: 'start',
              loop,
            }}
            className="w-full"
            data-testid="landing-testimonials-carousel"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {testimonials.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 sm:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  data-testid={`landing-testimonial-slide-${index}`}
                >
                  <div
                    className="h-full rounded-3xl border border-border bg-card p-7 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                    data-testid={`landing-testimonial-card-${index}`}
                  >
                    {/* Top Quote Decoration & Star Rating */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {/* 5-Star Rating */}
                        <div
                          className="flex items-center gap-1 text-accent-gold"
                          aria-label={`Rating ${item.rating} dari 5 bintang`}
                        >
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current stroke-none" />
                          ))}
                        </div>

                        <Quote className="h-7 w-7 text-primary/15" aria-hidden="true" />
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic font-sans min-h-[96px]">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Author & Wedding Details */}
                    <div className="mt-8 pt-5 border-t border-border/70 flex items-center gap-3.5">
                      {/* Monogram Badge */}
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-tint text-primary font-semibold text-xs border border-border-soft tracking-wider"
                        aria-hidden="true"
                      >
                        {getMonogram(item.names)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground font-sans truncate">
                          {item.names}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <span className="truncate">{item.location}</span>
                          <span>•</span>
                          <span className="truncate">{item.date}</span>
                        </div>
                        {item.templateName && (
                          <span className="inline-block mt-1 text-[11px] text-primary font-medium">
                            {item.templateName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Conditionally rendered Prev / Next navigation buttons */}
            {showControls && (
              <>
                <CarouselPrevious
                  className="hidden sm:flex -left-3 lg:-left-6"
                  data-testid="landing-testimonials-prev-btn"
                />
                <CarouselNext
                  className="hidden sm:flex -right-3 lg:-right-6"
                  data-testid="landing-testimonials-next-btn"
                />
              </>
            )}
          </Carousel>

          {/* Optional Pagination Dots */}
          {showDots && count > 1 && (
            <div
              className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
              data-testid="landing-testimonials-dots"
            >
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Menuju ulasan ${index + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    current === index
                      ? 'w-7 bg-primary'
                      : 'w-2 bg-border hover:bg-primary/40'
                  )}
                  data-testid={`landing-testimonials-dot-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
