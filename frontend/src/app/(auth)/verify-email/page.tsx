'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/services/api/auth.api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token verifikasi tidak ditemukan pada tautan.');
      return;
    }

    authApi
      .confirmEmailVerification({ token })
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Tautan verifikasi tidak valid atau telah kedaluwarsa.'
        );
      });
  }, [token]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="auth-verify-email-container">
      {/* Brand Glyph & Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Verifikasi Alamat Email
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Mengonfirmasi keabsahan identitas akun Anda di platform undangan kami.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center space-y-6 shadow-xs">
        {status === 'loading' && (
          <div className="space-y-4 py-6" data-testid="auth-verify-loading">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">
              Memproses konfirmasi verifikasi email Anda...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6" data-testid="auth-verify-success">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success-foreground">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">
                Email Berhasil Diverifikasi!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Akun Anda telah aktif sepenuhnya. Anda kini dapat membuat, mempublikasikan, dan membagikan undangan pernikahan Anda dengan aman.
              </p>
            </div>
            <Link href="/dashboard" className="block w-full">
              <Button className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/20" data-testid="auth-verify-to-dashboard-btn">
                <span>Lanjutkan ke Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6" data-testid="auth-verify-error">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-foreground">
                Verifikasi Gagal
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {errorMessage || 'Tautan verifikasi tidak valid atau telah kedaluwarsa.'}
              </p>
            </div>
            <div className="space-y-2">
              <Link href="/dashboard" className="block w-full">
                <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold" data-testid="auth-verify-to-home-btn">
                  Kembali ke Dashboard
                </Button>
              </Link>
              <Link href="/login" className="block text-xs text-muted-foreground hover:text-primary transition-colors pt-2">
                Masuk ke akun lain
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-md mx-auto py-12 text-center text-sm text-muted-foreground">Memuat status verifikasi...</div>}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
