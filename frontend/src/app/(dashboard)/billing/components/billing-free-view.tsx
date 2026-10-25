import * as React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionInfo } from '@/services/api/billing.api';
import { BillingFeaturesGrid } from './billing-features-grid';

interface BillingFreeViewProps {
  subInfo: SubscriptionInfo | null;
  isProcessing: boolean;
  onCheckout: (plan: 'PRO') => void;
}

export function BillingFreeView({
  subInfo,
  isProcessing,
  onCheckout,
}: BillingFreeViewProps) {
  return (
    <div className="space-y-6 w-full" data-testid="billing-free-view">
      {/* Status Akun Starter */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-medium text-muted-caption tracking-wider block mb-1">
            Status Akun Saat Ini
          </span>
          <h2 className="text-xl font-bold text-foreground font-sans">
            {subInfo?.plan === 'FREE' || !subInfo ? 'Paket Starter (Gratis)' : subInfo.plan}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Draf undangan aktif dengan fasilitas dasar. Upgrade ke PRO untuk fitur premium tanpa batasan.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 font-semibold" data-testid="billing-starter-badge">
          Gratis
        </Badge>
      </div>

      {/* Kartu Upgrade PRO */}
      <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>Paling Diminati</span>
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
              sekali bayar per acara • aktif s.d. 1 bulan pasca resepsi
            </span>
          </div>
        </div>

        {/* Fasilitas Grid */}
        <div className="mt-6">
          <BillingFeaturesGrid isProActive={false} />
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-caption">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              Pembayaran sekali bayar untuk 1 acara (hosting aktif hingga 30 hari pasca resepsi) tanpa langganan otomatis via Snap Midtrans (QRIS, GoPay, ShopeePay, Virtual Account, & Kartu Kredit).
            </span>
          </div>
          <Button
            onClick={() => onCheckout('PRO')}
            disabled={isProcessing}
            className="w-full sm:w-auto min-w-[220px] font-semibold"
            data-testid="billing-checkout-pro-btn"
          >
            {isProcessing ? 'Menyiapkan Checkout...' : 'Upgrade ke Paket PRO'}
          </Button>
        </div>
      </div>
    </div>
  );
}
