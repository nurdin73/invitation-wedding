import React from 'react';
import { Palette, Edit3, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimelineStep {
  step: string;
  tag: string;
  icon: React.ElementType;
  title: string;
  description: string;
  featurePill: string;
}

const TIMELINE_STEPS: readonly TimelineStep[] = [
  {
    step: '01',
    tag: 'Pilih Desain',
    icon: Palette,
    title: 'Pilih Tampilan yang Disukai',
    description:
      'Pilih desain undangan yang cocok dengan konsep pernikahan Anda, mulai dari gaya minimalis, bunga romantis, adat nusantara, hingga modern.',
    featurePill: 'Tampilan rapi dan pas di semua layar HP',
  },
  {
    step: '02',
    tag: 'Isi Data Acara',
    icon: Edit3,
    title: 'Masukkan Jadwal, Lokasi & Foto',
    description:
      'Tulis nama kedua mempelai, waktu akad dan resepsi, petunjuk arah lokasi acara, nomor rekening hadiah, serta foto kebersamaan Anda.',
    featurePill: 'Bisa diisi dan diubah kapan saja dengan mudah',
  },
  {
    step: '03',
    tag: 'Kirim ke Tamu',
    icon: Share2,
    title: 'Bagikan Lewat WhatsApp',
    description:
      'Dapatkan link undangan dan kirim langsung ke kontak Anda. Nama setiap tamu bisa dicantumkan secara khusus agar terasa lebih akrab.',
    featurePill: 'Jawaban kehadiran tamu langsung tercatat rapi',
  },
] as const;

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-background transition-colors"
      data-testid="landing-how-it-works-section"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm"
            data-testid="landing-how-it-works-badge"
          >
            Langkah Mudah
          </Badge>

          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground"
            data-testid="landing-how-it-works-title"
          >
            Tiga Langkah{' '}
            <span className="font-serif italic font-normal text-primary">Membuat Undangan</span>
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid="landing-how-it-works-subtitle"
          >
            Dari memilih desain hingga undangan siap dikirimkan ke keluarga dan sahabat Anda.
          </p>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {TIMELINE_STEPS.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === TIMELINE_STEPS.length - 1;

              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center group"
                  data-testid={`landing-step-${index + 1}`}
                >
                  {/* Desktop Horizontal Connecting Line (from center of this node to center of next node) */}
                  {!isLast && (
                    <div
                      className="hidden md:block absolute top-7 left-1/2 w-full h-[2px] border-t-2 border-dashed border-primary/30 -z-0 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}

                  {/* Step Milestone Node */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary bg-card text-primary shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-foreground shadow-xs">
                      {item.step}
                    </span>
                  </div>

                  {/* Step Card Content */}
                  <div className="mt-6 w-full rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md flex flex-col justify-between flex-1 text-left">
                    <div>
                      {/* Tag Badge */}
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                        <Sparkles className="h-3 w-3" />
                        <span>{item.tag}</span>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight font-sans">
                        {item.title}
                      </h3>

                      {/* Step Description */}
                      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Step Feature Pill Footer */}
                    <div className="mt-6 pt-3.5 border-t border-border/70 flex items-center gap-2 text-xs text-muted-caption">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.featurePill}</span>
                    </div>
                  </div>

                  {/* Mobile Vertical Connecting Line Between Steps */}
                  {!isLast && (
                    <div
                      className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-primary/30 my-2"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
