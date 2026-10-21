import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlanFeature {
  label: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  isPopular?: boolean;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref: string;
}

const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Cocok untuk mencoba fitur visual editor dan membuat draft undangan pertama Anda.',
    price: 'Rp 0',
    period: 'coba gratis 14 hari',
    features: [
      { label: '1 Undangan aktif (masa aktif 14 hari)', included: true },
      { label: 'Kolom komentar, ucapan & doa dari tamu', included: true },
      { label: 'Pilihan template desain dasar', included: true },
      { label: 'Hingga 4 foto galeri pre-wedding', included: true },
      { label: 'Peta petunjuk arah Google Maps', included: true },
      { label: 'Amplop digital & nomor rekening bank', included: false },
      { label: 'Musik latar romantis pilihan', included: false },
      { label: 'Sematan video kenangan', included: false },
      { label: 'Bonus desain undangan fisik siap cetak', included: false },
      { label: 'Bantuan setup & pengisian oleh admin', included: false },
    ],
    ctaLabel: 'Coba Gratis Sekarang',
    ctaHref: '/register',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Pilihan lengkap sekali bayar untuk hari bahagia Anda dengan fitur tanpa batas.',
    price: 'Rp 49.000',
    period: 'sekali bayar per acara',
    isPopular: true,
    features: [
      { label: 'Masa aktif undangan hingga 3 bulan', included: true },
      { label: 'Kolom komentar, ucapan & doa tanpa batas', included: true },
      { label: 'Buka semua tema karya kontributor desainer', included: true },
      { label: 'Hingga 15 foto galeri pilihan (resolusi optimal)', included: true },
      { label: '1 Sematan video kenangan (YouTube / Vimeo)', included: true },
      { label: 'Amplop digital & nomor rekening bank', included: true },
      { label: 'Musik latar romantis bebas pilih lagu', included: true },
      { label: 'Peta petunjuk arah Google Maps & navigasi', included: true },
      { label: 'Bonus desain undangan fisik siap cetak (PDF)*', included: true },
      { label: 'Bantuan setup & pengisian oleh admin', included: true },
    ],
    ctaLabel: 'Pilih Paket Pro',
    ctaHref: '/register',
  },
] as const;

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 bg-background transition-colors"
      data-testid="landing-pricing-section"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm"
            data-testid="landing-pricing-badge"
          >
            Paket & Biaya
          </Badge>

          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground"
            data-testid="landing-pricing-title"
          >
            Pilihan Paket yang{' '}
            <span className="font-serif italic font-normal text-primary">Jelas & Terjangkau</span>
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid="landing-pricing-subtitle"
          >
            Satu kali pembayaran untuk momen bahagia Anda, tanpa biaya langganan bulanan tersembunyi.
          </p>
        </div>

        {/* 2-Tier Symmetric Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 ${
                  isPopular
                    ? 'border-2 border-primary bg-accent-tint/70 shadow-lg ring-4 ring-primary/10'
                    : 'border border-border bg-card shadow-sm hover:border-primary/40 hover:shadow-md'
                }`}
                data-testid={`landing-pricing-card-${plan.id}`}
              >
                {/* Popular Pill Ribbon */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Paling Diminati</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground font-sans tracking-tight">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                    {plan.tagline}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-6 pb-6 border-b border-border/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-sans">
                        {plan.price}
                      </span>
                    </div>
                    <span className="mt-1 block text-xs text-muted-caption">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features Checklist */}
                  <div className="mt-6 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-caption block">
                      Fasilitas yang Didapat:
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        {feature.included ? (
                          <div
                            className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isPopular
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent-tint text-primary'
                            }`}
                          >
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-muted text-muted-caption flex items-center justify-center shrink-0 mt-0.5">
                            <X className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        )}
                        <span
                          className={
                            feature.included
                              ? 'text-foreground font-medium'
                              : 'text-muted-caption line-through'
                          }
                        >
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA Button */}
                <div className="mt-8 pt-4 border-t border-border/80">
                  <Link href={plan.ctaHref} className="block w-full">
                    <Button
                      variant={isPopular ? 'default' : 'outline'}
                      size="lg"
                      className="w-full gap-2 font-semibold shadow-xs"
                      data-testid={`landing-pricing-btn-${plan.id}`}
                    >
                      <span>{plan.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote on Physical Invitation Design Bonus */}
        <p className="mt-4 text-center text-xs text-muted-caption max-w-2xl mx-auto">
          *File desain undangan fisik siap cetak berformat PDF resolusi tinggi disiapkan serasi oleh kontributor template untuk dicetak mandiri di percetakan pilihan Anda.
        </p>

        {/* Contributor Marketplace Callout Banner */}
        <div
          className="mt-12 max-w-4xl mx-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-primary/40"
          data-testid="landing-pricing-contributor-banner"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-primary border border-border-soft">
              <Palette className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Program Kreator</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-caption">Bagi Hasil Setiap Undangan</span>
              </div>
              <h4 className="text-lg font-bold text-foreground font-sans">
                Punya Bakat Desain? Bergabung Menjadi Kontributor Template
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Kirimkan karya template website beserta desain kartu fisik yang serasi. Dapatkan penghasilan bagi hasil (fee) setiap kali karya Anda digunakan oleh calon pengantin.
              </p>
            </div>
          </div>

          <Link href="/register?role=contributor" className="shrink-0 w-full md:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full md:w-auto gap-2 border-primary/30 text-primary hover:bg-accent-tint hover:text-primary font-medium"
              data-testid="landing-pricing-contributor-btn"
            >
              <span>Daftar Kontributor</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
