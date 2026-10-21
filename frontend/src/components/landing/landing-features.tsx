import React from 'react';
import { Layers, UserCheck, Wallet, Music, Printer, FileText, CheckCircle2, ArrowUpDown, Download } from 'lucide-react';
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

          {/* Bento Item 3: Digital Envelope & Background Music (Pro Feature) - 6 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-6 flex flex-col justify-between"
            data-testid="landing-feature-bento-envelope"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft">
                  <Wallet className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 bg-accent-tint/60 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                  data-testid="landing-feature-bento-envelope-badge"
                >
                  Paket Pro
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight font-sans">
                Amplop Digital & Musik Pilihan
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Fasilitasi tanda kasih melalui rekening bank & dompet digital serta hadirkan musik latar romantis otomatis untuk menyempurnakan suasana.
              </p>
            </div>

            {/* Micro Card Snapshot: Envelope & Music */}
            <div className="mt-6 space-y-2.5">
              <div className="rounded-2xl border border-border-soft bg-accent-tint/40 p-3.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-caption font-semibold">Tanda Kasih Digital</span>
                  <p className="text-xs font-semibold text-foreground">BCA / Mandiri / BSI & E-Wallet</p>
                </div>
                <span className="rounded-lg bg-card px-2.5 py-1 text-xs font-medium text-primary border border-border shadow-2xs">
                  Salin Rekening
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-tint text-primary shrink-0">
                    <Music className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">A Thousand Years</p>
                    <p className="text-[10px] text-muted-caption">Bebas Pilih Lagu Favorit</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-primary bg-accent-tint px-2 py-0.5 rounded-md">
                  Autoplay
                </span>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Bonus Desain Undangan Fisik Siap Cetak (PDF) - 6 cols */}
          <div
            className="group relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md md:col-span-6 flex flex-col justify-between"
            data-testid="landing-feature-bento-print-design"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-primary border border-border-soft">
                  <Printer className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 bg-accent-tint/60 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                  data-testid="landing-feature-bento-print-badge"
                >
                  Bonus Paket Pro
                </Badge>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight font-sans">
                Bonus Desain Fisik Siap Cetak
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Dapatkan file dokumen PDF resolusi tinggi (300 DPI) siap cetak mandiri di percetakan, dengan desain serasi untuk keluarga sepuh atau tamu kehormatan.
              </p>
            </div>

            {/* Document Print Snapshot */}
            <div className="mt-6 rounded-2xl border border-border bg-background/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-tint text-primary shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Kartu Undangan Cetak (PDF)</p>
                    <p className="text-[10px] text-muted-caption">Resolusi 300 DPI • Siap Cetak Percetakan</p>
                  </div>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-primary shadow-xs">
                  <Download className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-caption">
                <span>Format: PDF Vektor Standar Percetakan</span>
                <span className="flex items-center gap-1 text-primary font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Desain Serasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
