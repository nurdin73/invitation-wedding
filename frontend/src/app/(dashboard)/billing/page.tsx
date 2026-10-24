'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { billingApi, type SubscriptionInfo } from '@/services/api/billing.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';

export default function BillingPage() {
  const [subInfo, setSubInfo] = React.useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const setHeader = useDashboardHeaderStore((s) => s.setHeader);
  const resetHeader = useDashboardHeaderStore((s) => s.resetHeader);

  const fetchSubscription = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await billingApi.getSubscription();
      if (res.data) setSubInfo(res.data);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Daftarkan konfigurasi breadcrumb, title, back button, dan actions ke header store
  React.useEffect(() => {
    setHeader({
      title: 'Paket Langganan & Tagihan',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Paket & Tagihan' },
      ],
      showBackButton: true,
      backButtonHref: '/dashboard',
      actions: [
        {
          type: 'button',
          button: {
            id: 'refresh-billing-status',
            label: 'Segarkan Status',
            variant: 'outline',
            icon: RefreshCw,
            onClick: fetchSubscription,
            dataTestId: 'billing-refresh-btn',
          },
        },
        {
          type: 'dropdown',
          dropdown: {
            id: 'billing-options',
            triggerLabel: 'Informasi Tagihan',
            triggerIcon: HelpCircle,
            items: [
              {
                id: 'billing-faq',
                label: 'FAQ Pembayaran Midtrans',
                onClick: () => {
                  toast.info('Pembayaran otomatis terverifikasi via QRIS, Virtual Account, atau Kartu Kredit.');
                },
              },
            ],
          },
        },
      ],
    });

    return () => {
      resetHeader();
    };
  }, [setHeader, resetHeader, fetchSubscription]);

  const handleCheckout = async (plan: 'PRO' = 'PRO') => {
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
      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Memuat info paket...</div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-medium text-muted-foreground tracking-wider">Status Akun Saat Ini</span>
              <h2 className="text-xl font-bold text-foreground">
                {subInfo?.isSubscriberActive ? 'Paket PRO' : 'Paket Starter (Gratis)'}
              </h2>
            </div>
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-semibold ${
                subInfo?.isSubscriberActive
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {subInfo?.isSubscriberActive ? 'Aktif' : 'Gratis'}
            </span>
          </div>
        </div>
      )}

      {/* Paket PRO Card */}
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-bl-xl shadow-xs">
          Paling Diminati
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <h3 className="font-bold text-2xl text-foreground font-sans">Paket PRO</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Pilihan lengkap sekali bayar untuk hari bahagia Anda dengan seluruh fitur eksklusif tanpa batasan.
            </p>
          </div>
          <div className="md:text-right shrink-0">
            <div className="text-3xl font-extrabold text-foreground font-sans">
              Rp 49.000
            </div>
            <span className="text-xs text-muted-caption">
              sekali bayar per acara
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-caption block mb-3">
            Fasilitas yang Didapat:
          </span>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Masa aktif undangan hingga acara selesai</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Buka semua tema & template eksklusif</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Musik latar romantis autoplay</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Amplop digital & nomor rekening bank / QRIS</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Kisah perjalanan cinta (Love Story Timeline)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Galeri foto hingga 15 foto resolusi optimal</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Buku ucapan, doa & konfirmasi kehadiran (RSVP)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-primary font-bold">✓</span>
              <span>Peta petunjuk arah Google Maps & navigasi</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-caption">
            Pembayaran otomatis diverifikasi via Snap Midtrans (QRIS, GoPay, ShopeePay, Virtual Account, & Kartu Kredit).
          </p>
          <Button
            onClick={() => handleCheckout('PRO')}
            disabled={isProcessing || Boolean(subInfo?.isSubscriberActive)}
            className="w-full sm:w-auto min-w-[220px] font-semibold"
            data-testid="billing-checkout-pro-btn"
          >
            {subInfo?.isSubscriberActive ? 'Paket PRO Sudah Aktif' : 'Upgrade ke Paket PRO'}
          </Button>
        </div>
      </div>
    </div>
  );
}
