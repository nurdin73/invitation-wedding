'use client';

import * as React from 'react';
import { RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    console.error('Fatal root layout error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FAF8F5] text-[#3A302C] antialiased flex items-center justify-center p-6">
        <div
          data-testid="fatal-error-container"
          className="w-full max-w-lg rounded-2xl border border-[#ECE5DE] bg-white p-8 sm:p-10 text-center shadow-lg"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-[#F2DFDC] bg-[#FDF0EE] text-xs font-mono font-semibold tracking-wider text-[#B86B70]">
            FATAL SYSTEM ERROR
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#3A302C] mb-3">
            Sistem Mengalami Kendala Kritis
          </h1>
          <p className="text-sm text-[#73635C] leading-relaxed mb-6">
            Aplikasi mengalami kegagalan pada komponen kerangka utama. Silakan coba muat ulang halaman.
          </p>

          {error.digest && (
            <div className="mb-6 rounded-lg border border-[#ECE5DE] bg-[#F5EFEB] p-3 text-left">
              <span className="text-[11px] font-mono text-[#A89B95] block mb-1">
                ERROR DIGEST:
              </span>
              <code className="text-xs font-mono text-[#3A302C] break-all">{error.digest}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => reset()}
              data-testid="fatal-error-reset-btn"
              className="w-full sm:w-auto bg-[#B86B70] hover:bg-[#B86B70]/90 text-white gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Muat Ulang Halaman</span>
            </Button>
            <Button
              asChild
              variant="outline"
              data-testid="fatal-error-home-link"
              className="w-full sm:w-auto border-[#ECE5DE] gap-2"
            >
              <a href="/">
                <Home className="w-4 h-4" />
                <span>Beranda Utama</span>
              </a>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
