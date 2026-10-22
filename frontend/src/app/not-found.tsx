import Link from 'next/link';
import { Home, LayoutDashboard, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export default function UniversalNotFound() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between bg-background text-foreground"
      data-testid="universal-not-found-page"
    >
      {/* Full-Width Expansive Header */}
      <header className="w-full border-b border-border/60 bg-card/40 backdrop-blur-md px-6 sm:px-12 lg:px-16 py-4">
        <div className="flex w-full items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            data-testid="not-found-brand-logo"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-tint border border-border-soft text-primary shadow-xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>

          <Link
            href="/dashboard"
            data-testid="not-found-header-dashboard-link"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Buka Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Centered Content (Spacious & Focused, No Recommendation Cards) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center py-12 lg:py-20">

        {/* Large 404 & Headline */}
        <div className="space-y-3 mb-6">
          <h1
            data-testid="not-found-code-hero"
            className="font-heading text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-foreground select-none"
          >
            404
          </h1>
          <h2
            data-testid="not-found-title"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground"
          >
            Halaman Tidak Ditemukan
          </h2>
        </div>

        {/* Description */}
        <p
          data-testid="not-found-description"
          className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
        >
          Halaman yang Anda cari tidak dapat ditemukan atau sudah tidak tersedia.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            data-testid="not-found-primary-home-btn"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'gap-2 w-full sm:w-auto min-w-[170px]'
            )}
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/dashboard"
            data-testid="not-found-secondary-dashboard-btn"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'gap-2 w-full sm:w-auto min-w-[170px]'
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Buka Dashboard</span>
          </Link>
        </div>
      </main>

      {/* Full-Width Expansive Footer */}
      <footer className="w-full border-t border-border/60 py-5 px-6 sm:px-12 lg:px-16 bg-card/20">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-3 text-xs text-muted-caption">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">
              Paket Harga
            </Link>
            <Link href="/#faq" className="hover:text-foreground transition-colors">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
