'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { HelpCircle, RefreshCw, Loader2 } from 'lucide-react';
import { billingApi, type SubscriptionInfo } from '@/services/api/billing.api';
import { useDashboardHeaderStore } from '@/lib/stores/dashboard-header.store';
import { BillingProView } from './components/billing-pro-view';
import { BillingFreeView } from './components/billing-free-view';

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
      toast.error(err instanceof Error ? err.message : 'Gagal memuat status langganan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

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

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center p-16 text-muted-foreground gap-2.5 text-sm"
        data-testid="billing-loading-state"
      >
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Memuat status langganan & tagihan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full" data-testid="billing-page">
      {subInfo?.isSubscriberActive ? (
        <BillingProView subInfo={subInfo} />
      ) : (
        <BillingFreeView
          subInfo={subInfo}
          isProcessing={isProcessing}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
