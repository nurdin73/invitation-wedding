'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Sparkles, Check, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useInvitationEditorStore } from '@/lib/stores/invitation-editor.store';
import { billingApi } from '@/services/api/billing.api';

export const ProUpgradeDialog: React.FC = () => {
  const isUpgradeModalOpen = useInvitationEditorStore((s) => s.isUpgradeModalOpen);
  const setUpgradeModalOpen = useInvitationEditorStore((s) => s.setUpgradeModalOpen);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCheckoutPro = async () => {
    setIsProcessing(true);
    try {
      const res = await billingApi.checkout('PRO');
      if (res.data?.redirectUrl) {
        toast.info('Membuka gerbang pembayaran aman Midtrans...');
        window.open(res.data.redirectUrl, '_blank');
        setUpgradeModalOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memulai transaksi checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
      <DialogContent
        className="max-w-md p-6 overflow-hidden"
        data-testid="pro-upgrade-dialog"
      >
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] text-[10px] font-bold uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tingkatkan ke Autora PRO</span>
          </div>

          <DialogTitle className="text-lg font-semibold text-foreground pt-1">
            Buka Seluruh Fitur Eksklusif Undangan
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            Satu kali pembayaran terjangkau untuk momen sakral sekali seumur hidup Anda.
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 my-2 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              Paket PRO Lengkap
            </span>
            <span className="text-2xl font-bold text-foreground">
              Rp 49.000
            </span>
          </div>
          <span className="text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md">
            Sekali Bayar
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2 py-1 text-xs">
          <p className="font-semibold text-foreground text-[11px]">
            Semua Fitur yang Anda Dapatkan:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-medium">Musik Latar Romantis:</strong> Putar lagu pilihan otomatis saat tamu membuka undangan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-medium">Amplop Digital & QRIS:</strong> Terima tanda kasih langsung ke rekening bank atau e-wallet.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-medium">Kapasitas 15 Foto Galeri:</strong> Unggah momen pre-wedding beresolusi tinggi (Starter hanya 4).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-medium">Linimasa Kisah Cinta:</strong> Rangkaian cerita awal pertemuan hingga pernikahan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-medium">Bebas Semua Template Desainer:</strong> Akses penuh palet warna dan tema premium.
              </span>
            </li>
          </ul>
        </div>

        {/* Security & Action */}
        <div className="pt-3 space-y-2 border-t border-border">
          <Button
            type="button"
            onClick={handleCheckoutPro}
            disabled={isProcessing}
            className="w-full gap-2 text-xs font-semibold h-9 shadow-md"
            data-testid="pro-upgrade-checkout-btn"
          >
            <span>{isProcessing ? 'Menyiapkan Pembayaran...' : 'Bayar Sekarang via Midtrans'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>QRIS, Virtual Account, Kartu Kredit</span>
            </span>

            <a
              href="/billing"
              target="_blank"
              className="hover:text-primary inline-flex items-center gap-1 underline underline-offset-2"
            >
              <span>Detail Paket</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
