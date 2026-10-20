import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              💍 WeddingSaaS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20 sm:py-32">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            ✨ Platform Undangan Pernikahan Digital Masa Depan
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Ciptakan Undangan Pernikahan Elegan dalam Hitungan Menit
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Template modern, editor kanvas responsif, RSVP interaktif, dan kustomisasi visual tanpa batas. Bagikan momen bahagia Anda dengan penuh gaya.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Mulai Buat Undangan
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Buka Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="container mx-auto grid gap-6 sm:grid-cols-3 max-w-4xl mt-20 text-left">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold text-foreground mb-1">Editor Visual Intuitif</h3>
            <p className="text-sm text-muted-foreground">
              Atur urutan bagian, palet warna, tipografi, dan foto dengan preview langsung di mobile chassis.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-2xl mb-2">💌</div>
            <h3 className="font-semibold text-foreground mb-1">RSVP & Buku Tamu</h3>
            <p className="text-sm text-muted-foreground">
              Terima konfirmasi kehadiran tamu undangan dan ucapan doa secara real-time.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-foreground mb-1">Ultra Cepat & Responsif</h3>
            <p className="text-sm text-muted-foreground">
              Ditenagai Next.js App Router dan Cloudflare R2 / S3 storage dengan performa tinggi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WeddingSaaS. All rights reserved.
      </footer>
    </div>
  );
}
