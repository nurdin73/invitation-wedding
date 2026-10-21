import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function LandingCta() {
  return (
    <section
      className="w-full py-24 sm:py-32 lg:py-36 bg-gradient-to-b from-card via-card-oat/30 to-accent-tint/50 border-t border-b border-border relative overflow-hidden"
      data-testid="landing-cta-section"
    >
      {/* Ambient Romantic Glow Accents */}
      <div
        className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-accent-tint blur-3xl opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-36 right-12 lg:right-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-12 left-12 lg:left-1/4 h-64 w-64 rounded-full bg-accent-gold/10 blur-3xl opacity-50"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Pill Badge */}
        <Badge
          variant="secondary"
          className="gap-1.5 px-3.5 py-1 text-xs font-medium border-border-soft bg-accent-tint text-primary mx-auto inline-flex"
          data-testid="landing-cta-badge"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Mulai Hari Bahagia Anda</span>
        </Badge>

        {/* Headline H2 */}
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground font-serif leading-tight"
          data-testid="landing-cta-title"
        >
          Wujudkan Undangan Pernikahan yang Anggun & Berkesan
        </h2>

        {/* Subhead */}
        <p
          className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans"
          data-testid="landing-cta-subtitle"
        >
          Buat undangan digital impian Anda hanya dalam beberapa menit. Pilih desain favorit, lengkapi data mempelai, dan bagikan momen istimewa ke seluruh keluarga serta sahabat.
        </p>

        {/* Dual CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 text-sm sm:text-base font-semibold px-8 h-12 shadow-sm"
              data-testid="landing-cta-register-btn"
            >
              <span>Mulai Buat Undangan Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="#templates" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-semibold px-7 h-12 border-border hover:bg-secondary hover:text-foreground"
              data-testid="landing-cta-templates-btn"
            >
              <span>Lihat Pilihan Desain</span>
            </Button>
          </Link>
        </div>

        {/* Trust Points */}
        <div
          className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground font-sans"
          data-testid="landing-cta-trust-points"
        >
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded-full bg-accent-tint text-primary flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
            </div>
            <span>Gratis coba buat draft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded-full bg-accent-tint text-primary flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
            </div>
            <span>Tanpa perlu kartu kredit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded-full bg-accent-tint text-primary flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
            </div>
            <span>Dapat diedit kapan saja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
