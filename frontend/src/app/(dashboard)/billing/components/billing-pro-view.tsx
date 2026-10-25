import * as React from 'react';
import Link from 'next/link';
import {
  Crown,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionInfo } from '@/services/api/billing.api';
import { BillingFeaturesGrid } from './billing-features-grid';

interface BillingProViewProps {
  subInfo: SubscriptionInfo;
}

function formatDate(isoString: string | null): string {
  if (!isoString) return '1 Tahun Sejak Aktivasi';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

function formatPaymentType(paymentType: string | null): string {
  if (!paymentType) return 'Midtrans Snap (QRIS / VA)';
  const map: Record<string, string> = {
    qris: 'QRIS (Gopay, ShopeePay, Dana, dll.)',
    gopay: 'GoPay',
    shopeepay: 'ShopeePay',
    bank_transfer: 'Virtual Account (Bank Transfer)',
    credit_card: 'Kartu Kredit / Debit',
    echannel: 'Mandiri Bill',
  };
  return map[paymentType.toLowerCase()] ?? paymentType.toUpperCase();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BillingProView({ subInfo }: BillingProViewProps) {
  const latestOrder = subInfo.latestOrder;

  return (
    <div className="space-y-6 w-full" data-testid="billing-pro-view">
      {/* Hero Banner Status Aktif */}
      <div
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden"
        data-testid="billing-pro-hero"
      >
        <div className="absolute top-0 right-0 bg-success text-success-foreground border-b border-l border-success-foreground/20 px-4 py-1.5 rounded-bl-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-success-foreground" />
          <span>Keanggotaan PRO Aktif</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <Badge variant="success" className="gap-1.5 py-1 px-3 text-xs" data-testid="billing-active-pill">
                <Crown className="h-3.5 w-3.5" />
                Paket PRO Aktif
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">Pembayaran Sekali (Tanpa Tagihan Berulang)</span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground font-heading">
              Selamat! Akun Anda Berstatus PRO
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Seluruh fasilitas eksklusif, template premium, musik latar romantis, dan kuota tanpa
              batas telah aktif untuk mempersiapkan hari bahagia pernikahan Anda.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Masa Aktif Hosting Undangan: <strong className="text-foreground">{formatDate(subInfo.expiresAt)}</strong> (1 Tahun)</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-success-foreground" />
                <span>Terverifikasi Otomatis (Midtrans)</span>
              </div>
            </div>

            <p className="text-xs text-muted-caption pt-0.5">
              *Website undangan Anda aktif melayani tamu hingga tanggal di atas tanpa biaya perpanjangan otomatis.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <Button asChild className="gap-2 font-semibold shadow-xs" data-testid="billing-pro-cta-dashboard">
              <Link href="/dashboard" className='flex items-center gap-2'>
                <span>Kelola Undangan Saya</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Rincian Transaksi Midtrans */}
      {latestOrder && (
        <div
          className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4"
          data-testid="billing-order-receipt"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent-tint/60 text-primary flex items-center justify-center">
                <Receipt className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground font-sans">
                  Rincian Transaksi Pembayaran
                </h3>
                <p className="text-xs text-muted-foreground">
                  Informasi faktur dan verifikasi pelunasan paket PRO
                </p>
              </div>
            </div>
            <Badge variant="success" className="gap-1 font-semibold" data-testid="billing-order-status-badge">
              <CheckCircle2 className="h-3 w-3" />
              LUNAS (Settlement)
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-sm">
            <div>
              <span className="text-xs text-muted-caption block mb-1">Nomor Pesanan</span>
              <span className="font-mono text-xs font-semibold text-foreground block truncate" title={latestOrder.orderNumber}>
                {latestOrder.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-caption block mb-1">Metode Bayar</span>
              <span className="font-medium text-foreground text-xs block">
                {formatPaymentType(latestOrder.paymentType)}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-caption block mb-1">Waktu Transaksi</span>
              <span className="font-medium text-foreground text-xs block">
                {formatDateTime(latestOrder.updatedAt || latestOrder.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-caption block mb-1">Total Pembayaran</span>
              <span className="font-bold text-foreground text-sm block">
                {formatCurrency(latestOrder.amount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid Fasilitas yang Telah Terbuka */}
      <BillingFeaturesGrid isProActive={true} />
    </div>
  );
}
