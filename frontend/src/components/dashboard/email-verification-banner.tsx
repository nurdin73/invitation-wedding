'use client';

import * as React from 'react';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi, type UserProfile } from '@/services/api/auth.api';

interface EmailVerificationBannerProps {
  user: UserProfile | null;
}

export function EmailVerificationBanner({ user }: EmailVerificationBannerProps) {
  const [isSending, setIsSending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!user || user.isEmailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setIsSending(true);
      await authApi.sendEmailVerification();
      toast.success('Email verifikasi baru berhasil dikirim ke ' + user.email);
      setCooldown(60); // 60 detik cooldown
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Gagal mengirim email verifikasi. Silakan coba lagi.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="mb-6 rounded-2xl border border-accent-gold/40 bg-accent-tint/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      data-testid="dashboard-email-verification-banner"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/20 text-accent-gold">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-foreground">
            Alamat Email Belum Terverifikasi
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Periksa kotak masuk email <span className="font-semibold text-foreground">{user.email}</span> untuk mengaktifkan akun dan memastikan keamanan undangan Anda.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSending || cooldown > 0}
        onClick={handleResendVerification}
        className="shrink-0 h-9 rounded-xl border-accent-gold/40 text-foreground hover:bg-card text-xs font-semibold"
        data-testid="dashboard-resend-verification-btn"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Mengirim...
          </>
        ) : cooldown > 0 ? (
          `Kirim Ulang (${cooldown}s)`
        ) : (
          <>
            <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Kirim Ulang Email
          </>
        )}
      </Button>
    </div>
  );
}
