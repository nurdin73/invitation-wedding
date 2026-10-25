import * as React from 'react';
import {
  Palette,
  Music,
  CreditCard,
  Heart,
  Camera,
  MessageSquareHeart,
  MapPin,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeatureItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const PRO_FEATURES: FeatureItem[] = [
  {
    id: 'themes',
    icon: Palette,
    title: 'Semua Tema Eksklusif',
    description: 'Akses penuh seluruh tema modern, floral, rustic, dan editorial tanpa batasan.',
  },
  {
    id: 'music',
    icon: Music,
    title: 'Musik Latar Autoplay',
    description: 'Putar alunan instrumen romantis otomatis saat undangan dibuka oleh tamu.',
  },
  {
    id: 'envelope',
    icon: CreditCard,
    title: 'Amplop Digital & QRIS',
    description: 'Nomor rekening bank & scan QRIS langsung untuk memudahkan hadiah pernikahan.',
  },
  {
    id: 'story',
    icon: Heart,
    title: 'Love Story Timeline',
    description: 'Dokumentasikan perjalanan cinta dan momen berharga Anda secara interaktif.',
  },
  {
    id: 'gallery',
    icon: Camera,
    title: 'Galeri Foto HD (15 Foto)',
    description: 'Tampilkan hingga 15 foto beresolusi tinggi dengan optimasi WebP super ringan.',
  },
  {
    id: 'rsvp',
    icon: MessageSquareHeart,
    title: 'RSVP & Buku Doa Tamu',
    description: 'Konfirmasi kehadiran dan ucapan doa restu tamu terdata secara rapi & real-time.',
  },
  {
    id: 'maps',
    icon: MapPin,
    title: 'Peta & Navigasi Google Maps',
    description: 'Arahkan rute tamu langsung menuju lokasi akad dan resepsi dengan 1 klik.',
  },
  {
    id: 'watermark',
    icon: Sparkles,
    title: 'Bebas Watermark & Iklan',
    description: 'Tampilan undangan bersih, eksklusif, dan profesional tanpa watermark platform.',
  },
];

interface BillingFeaturesGridProps {
  isProActive?: boolean;
}

export function BillingFeaturesGrid({ isProActive = false }: BillingFeaturesGridProps) {
  return (
    <div className="space-y-4" data-testid="billing-features-section">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground font-sans">
            {isProActive ? 'Fasilitas & Fitur PRO Anda' : 'Fasilitas yang Didapat di Paket PRO'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isProActive
              ? 'Seluruh fitur di bawah ini telah aktif dan dapat langsung Anda gunakan di editor undangan.'
              : 'Dapatkan akses menyeluruh ke semua fitur berikut sekali bayar untuk hari bahagia Anda.'}
          </p>
        </div>
        {isProActive && (
          <Badge variant="success" className="gap-1 shrink-0" data-testid="billing-all-unlocked-badge">
            <CheckCircle2 className="h-3 w-3" />
            Semua Terbuka
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {PRO_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              data-testid={`billing-feature-${feature.id}`}
              className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-accent-tint/60 text-primary flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  {isProActive ? (
                    <span className="text-[11px] font-semibold text-success-foreground bg-success px-2 py-0.5 rounded-full flex items-center gap-1 border border-success-foreground/20">
                      <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-caption">PRO</span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1 font-sans">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
