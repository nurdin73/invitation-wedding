import React from 'react';
import { Layers, UserCheck, Wallet, Music, MapPin, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="py-20 sm:py-28 bg-card-oat/40 border-t border-b border-border transition-colors"
      data-testid="landing-features-section"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-sm"
            data-testid="landing-features-badge"
          >
            Fitur Utama
          </Badge>

          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground"
            data-testid="landing-features-title"
          >
            Semua Kebutuhan{' '}
            <span className="font-serif italic font-normal text-primary">Undangan Digital</span>{' '}
            Anda
          </h2>

          <p
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
            data-testid="landing-features-subtitle"
          >
            Fitur praktis untuk mempermudah perancangan susunan acara, pencatatan kehadiran tamu, dan penyampaian informasi penting.
          </p>
        </div>

        {/* Bento Grid Layout (Asymmetric 4-Block Composition) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Featured Large Card (Editor Visual Stacking) - 8 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-7 lg:col-span-8 flex flex-col justify-between overflow-hidden"
            data-testid="landing-feature-bento-editor"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft mb-5">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Editor Visual Fleksibel
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
                Atur urutan bagian undangan (sampul, informasi mempelai, susunan acara, hingga galeri foto) secara leluasa dengan pratinjau yang langsung terlihat.
              </p>
            </div>

            {/* Visual Layer Stack Simulation */}
            <div className="mt-8 rounded-2xl border border-border/80 bg-background/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-tint text-primary text-xs font-semibold">1</div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Sampul & Pembuka Undangan</span>
                </div>
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-caption" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-tint text-primary text-xs font-semibold">2</div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Profil Kedua Mempelai & Orang Tua</span>
                </div>
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-caption" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-tint text-primary text-xs font-semibold">3</div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">Jadwal Akad & Resepsi Pernikahan</span>
                </div>
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-caption" />
              </div>
            </div>
          </div>

          {/* Bento Item 2: Guest Attendance Counter - 4 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-5 lg:col-span-4 flex flex-col justify-between"
            data-testid="landing-feature-bento-attendance"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft mb-5">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Konfirmasi Kehadiran
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Pencatatan konfirmasi tamu secara langsung untuk mempermudah perhitungan porsi dan reservasi meja.
              </p>
            </div>

            {/* Attendance Metric Snapshot */}
            <div className="mt-8 rounded-2xl border border-border bg-background/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-caption font-medium">Rekapitulasi Tamu</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">128</span>
                <span className="text-xs text-muted-foreground">Tamu Pasti Hadir</span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-caption">
                <span>Respon Masuk: 94%</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Akurat
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 3: Digital Envelope & Bank Account - 6 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-6 flex flex-col justify-between"
            data-testid="landing-feature-bento-envelope"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft mb-5">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Amplop Digital & Rekening Bank
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Sediakan informasi nomor rekening bank atau dompet digital agar tamu undangan dapat mengirimkan tanda kasih dengan mudah dan aman.
              </p>
            </div>

            {/* Micro Card Snapshot */}
            <div className="mt-6 rounded-2xl border border-border-soft bg-accent-tint/40 p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-caption font-semibold">Tanda Kasih Digital</span>
                <p className="text-xs font-semibold text-foreground">BCA / Mandiri / BSI & E-Wallet</p>
              </div>
              <span className="rounded-lg bg-card px-3 py-1 text-xs font-medium text-primary border border-border shadow-2xs">
                Salin No. Rekening
              </span>
            </div>
          </div>

          {/* Bento Item 4: Background Music & Maps - 6 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-6 flex flex-col justify-between"
            data-testid="landing-feature-bento-music-maps"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft mb-5">
                <Music className="h-5 w-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                Musik Latar & Navigasi Lokasi
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Hadirkan alunan lagu romantis otomatis serta navigasi satu sentuhan ke Google Maps agar para tamu dapat menemukan tempat acara dengan nyaman.
              </p>
            </div>

            {/* Music Player & Maps Snippet */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background/80 p-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-tint text-primary shrink-0">
                  <Music className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">A Thousand Years</p>
                  <p className="text-[10px] text-muted-caption">Autoplay Aktif</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-tint text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground truncate">Google Maps</p>
                  <p className="text-[10px] text-muted-caption">Buka Rute Lokasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
