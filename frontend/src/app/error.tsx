'use client';

import * as React from 'react';
import { Home, RefreshCw } from 'lucide-react';
import { LandingNavbar, LandingFooter } from '@/components/landing';
import { ErrorState } from '@/components/feedback/error-state';

export interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  React.useEffect(() => {
    console.error('Root application uncaught error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background" data-testid="global-error-page">
      <LandingNavbar />
      <main className="flex-1 w-full flex items-center justify-center">
        <ErrorState
          code="500"
          badgeLabel="KODE 500 • KESALAHAN SISTEM"
          title="Terjadi Gangguan pada Sistem"
          description="Sistem kami sedang mengalami kendala sementara saat memproses permintaan Anda. Silakan coba muat ulang atau kembali ke beranda."
          variant="landing"
          testIdPrefix="landing-500"
          errorDetails={error.digest ? `Digest ID: ${error.digest}` : error.message || null}
          primaryAction={{
            label: 'Coba Lagi',
            onClick: () => reset(),
            icon: <RefreshCw className="w-4 h-4" />,
            variant: 'default',
          }}
          secondaryAction={{
            label: 'Kembali ke Beranda',
            href: '/',
            icon: <Home className="w-4 h-4" />,
            variant: 'outline',
          }}
        />
      </main>
      <LandingFooter />
    </div>
  );
}
