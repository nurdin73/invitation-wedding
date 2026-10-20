'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { billingApi, type SubscriptionInfo } from '@/services/api/billing.api';

export default function BillingPage() {
  const [subInfo, setSubInfo] = React.useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    billingApi
      .getSubscription()
      .then((res) => {
        if (res.data) setSubInfo(res.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCheckout = async (plan: 'PRO' | 'PLATINUM') => {
    setIsProcessing(true);
    try {
      const res = await billingApi.checkout(plan);
      if (res.data?.redirectUrl) {
        toast.info('Membuka halaman pembayaran Snap...');
        window.open(res.data.redirectUrl, '_blank');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memulai checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl" data-testid="billing-page">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Paket Langganan & Tagihan
        </h2>
        <p className="text-sm text-muted-foreground">
          Pilih paket yang sesuai untuk mengaktifkan fitur premium dan undangan tanpa batas.
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Memuat info paket...</div>
      ) : (
        <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-medium text-muted-foreground">Paket Saat Ini</span>
              <h3 className="text-xl font-bold text-foreground">
                {subInfo?.plan || 'FREE'}
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                subInfo?.isSubscriberActive
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {subInfo?.isSubscriberActive ? 'Aktif' : 'Gratis'}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Paket PRO */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-foreground">Paket PRO</h3>
              <span className="text-sm font-semibold text-primary">Rp 149.000</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Pilihan ideal untuk pasangan yang menginginkan kustomisasi tema penuh dan musik latar.
            </p>
            <ul className="space-y-2 text-sm text-foreground mb-6">
              <li>✓ Publikasi hingga 5 Undangan Aktif</li>
              <li>✓ Kustomisasi Font & Warna Tak Terbatas</li>
              <li>✓ Musik Latar Autoplay</li>
              <li>✓ Galeri Foto hingga 20 File WebP</li>
            </ul>
          </div>
          <Button
            onClick={() => handleCheckout('PRO')}
            disabled={isProcessing}
            className="w-full"
            data-testid="billing-checkout-pro-btn"
          >
            Upgrade ke Paket PRO
          </Button>
        </div>

        {/* Paket PLATINUM */}
        <div className="rounded-xl border-2 border-primary bg-card p-6 shadow-sm flex flex-col justify-between relative">
          <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
            Paling Populer
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-foreground">Paket PLATINUM</h3>
              <span className="text-sm font-semibold text-primary">Rp 299.000</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Fitur terlengkap untuk pengalaman pernikahan digital mewah tanpa kompromi.
            </p>
            <ul className="space-y-2 text-sm text-foreground mb-6">
              <li>✓ Publikasi Undangan Tanpa Batas</li>
              <li>✓ Custom Subdomain / Domain Sendiri</li>
              <li>✓ Buku Tamu Digital & QR Check-in</li>
              <li>✓ Prioritas Layanan Dukungan Pelanggan</li>
            </ul>
          </div>
          <Button
            onClick={() => handleCheckout('PLATINUM')}
            disabled={isProcessing}
            className="w-full"
            data-testid="billing-checkout-platinum-btn"
          >
            Pilih Paket PLATINUM
          </Button>
        </div>
      </div>
    </div>
  );
}
