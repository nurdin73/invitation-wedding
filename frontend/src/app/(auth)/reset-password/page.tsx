'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sparkles, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { validateWithZod } from '@/lib/zod-formik';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Kata sandi baru wajib diisi.')
      .min(8, 'Kata sandi minimal 8 karakter.'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi kata sandi wajib diisi.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleResetSubmit = async (_values: ResetPasswordFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
      toast.success('Kata sandi berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui kata sandi. Silakan coba kembali.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="auth-reset-password-container">
      {/* Brand Glyph & Header */}
      <div className="space-y-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Atur Ulang Kata Sandi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {isSuccess
            ? 'Kata sandi baru Anda telah aktif. Anda kini dapat masuk kembali menggunakan kata sandi tersebut.'
            : 'Masukkan kata sandi baru yang aman untuk akun Anda.'}
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6 rounded-2xl border border-border/80 bg-card-oat/50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success-foreground">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Pembaruan Berhasil</p>
            <p className="text-xs text-muted-foreground">
              Kata sandi Anda telah diperbarui dengan aman.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full h-11 rounded-xl"
            data-testid="auth-reset-success-login-btn"
          >
            Masuk Sekarang
          </Button>
        </div>
      ) : (
        <Formik<ResetPasswordFormValues>
          initialValues={{ password: '', confirmPassword: '' }}
          validate={validateWithZod(resetPasswordSchema)}
          onSubmit={handleResetSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" data-testid="auth-reset-password-form">
              <FormController
                name="password"
                label="Kata Sandi Baru"
                type="password"
                required
                placeholder="Minimal 8 karakter"
                data-testid="auth-reset-password"
              />

              <FormController
                name="confirmPassword"
                label="Ulangi Kata Sandi Baru"
                type="password"
                required
                placeholder="Masukkan ulang kata sandi"
                data-testid="auth-reset-confirm-password"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
                data-testid="auth-reset-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Kata Sandi Baru'
                )}
              </Button>

              <div className="text-center pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline underline-offset-4"
                  data-testid="auth-reset-back-link"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
