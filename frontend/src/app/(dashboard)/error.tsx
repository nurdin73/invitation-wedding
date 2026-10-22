'use client';

import * as React from 'react';
import { RefreshCw, LayoutDashboard } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';

export interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  React.useEffect(() => {
    console.error('Dashboard workspace runtime error:', error);
  }, [error]);

  return (
    <div
      className="w-full h-full flex-1 flex items-center justify-center p-0"
      data-testid="dashboard-error-page"
    >
      <ErrorState
        code="500"
        badgeLabel="DASHBOARD • ERROR 500"
        title="Terjadi Kendala pada Sistem"
        description="Gagal memproses data ruang kerja Anda. Silakan coba kembali untuk memuat ulang data terkini tanpa kehilangan data tersimpan."
        variant="dashboard"
        testIdPrefix="dashboard-500"
        errorDetails={error.digest ? `Digest ID: ${error.digest}` : error.message || null}
        primaryAction={{
          label: 'Coba Lagi',
          onClick: () => reset(),
          icon: <RefreshCw className="w-4 h-4" />,
          variant: 'default',
        }}
        secondaryAction={{
          label: 'Kembali ke Dashboard',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          variant: 'outline',
        }}
      />
    </div>
  );
}
