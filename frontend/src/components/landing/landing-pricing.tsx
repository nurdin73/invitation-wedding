import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
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
    tagline: 'Cocok untuk mencoba fitur dan membuat draft undangan pertama Anda.',
    price: 'Rp 0',
    period: 'selamanya gratis',
    features: [
      { label: '1 Undangan aktif', included: true },
      { label: 'Masa aktif 14 hari', included: true },
      { label: 'Konfirmasi hingga 50 tamu', included: true },
      { label: '5 Foto galeri pre-wedding', included: true },
      { label: 'Peta petunjuk arah Google Maps', included: true },
      { label: 'Amplop digital & rekening bank', included: false },
      { label: 'Musik latar romantis pilihan', included: false },
      { label: 'Bebas watermark platform', included: false },
    ],
    ctaLabel: 'Mulai Gratis',
    ctaHref: '/register',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Pilihan paling lengkap dan bebas khawatir untuk hari bahagia Anda.',
    price: 'Rp 99.000',
    period: 'sekali bayar per acara',
    isPopular: true,
    features: [
      { label: 'Bebas jumlah tamu undangan', included: true },
      { label: 'Masa aktif undangan selamanya', included: true },
      { label: 'Konfirmasi kehadiran tanpa batas', included: true },
      { label: '20 Foto galeri & video kenangan', included: true },
      { label: 'Amplop digital & nomor rekening bank', included: true },
      { label: 'Musik latar romantis bebas pilih', included: true },
      { label: 'Peta petunjuk arah Google Maps', included: true },
      { label: 'Tanpa watermark platform', included: true },
    ],
    ctaLabel: 'Pilih Paket Pro',
    ctaHref: '/register',
  },
  {
    id: 'exclusive',
    name: 'Eksklusif',
    tagline: 'Untuk pasangan yang menginginkan nama website dan layanan istimewa.',
    price: 'Rp 199.000',
    period: 'sekali bayar per acara',
    features: [
      { label: 'Semua fitur lengkap pada Paket Pro', included: true },
      { label: 'Domain nama sendiri (.com / .my.id)', included: true },
      { label: 'Format kirim pesan WhatsApp otomatis', included: true },
      { label: 'Unduh daftar tamu ke format Excel', included: true },
      { label: 'Bantuan prioritas setup undangan', included: true },
      { label: 'Keamanan data dan link pribadi', included: true },
      { label: 'Tanpa batasan kuota kunjungan', included: true },
      { label: 'Garansi aktif hingga hari H', included: true },
    ],
    ctaLabel: 'Pilih Paket Eksklusif',
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

        {/* 3-Tier Grid with Equal Heights & Distinct Pro Background */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
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
      </div>
    </section>
  );
}
