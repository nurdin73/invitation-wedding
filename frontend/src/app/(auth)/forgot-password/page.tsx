'use client';

import * as React from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sparkles, ArrowLeft, MailCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { validateWithZod } from '@/lib/zod-formik';

import { authApi } from '@/services/api/auth.api';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Alamat email wajib diisi.')
    .email('Format alamat email tidak valid.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);

  const handleForgotSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword({ email: values.email });
      setSubmittedEmail(values.email);
      toast.success('Instruksi pemulihan telah dikirim ke email Anda jika terdaftar.');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Gagal mengirimkan tautan pemulihan. Silakan coba lagi.'
      );
    }
  };


  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="auth-forgot-password-container">
      {/* Brand Glyph & Header */}
      <div className="space-y-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Lupa Kata Sandi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {submittedEmail
            ? 'Tautan pemulihan telah dikirim. Silakan periksa kotak masuk atau spam email Anda.'
            : 'Masukkan alamat email yang terdaftar. Kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda.'}
        </p>
      </div>

      {submittedEmail ? (
        <div className="space-y-6 rounded-2xl border border-border/80 bg-card-oat/50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{submittedEmail}</p>
            <p className="text-xs text-muted-foreground">
              Tidak menerima email? Periksa folder spam atau kirim ulang dalam beberapa saat.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmittedEmail(null)}
            className="w-full h-11 rounded-xl"
            data-testid="auth-forgot-resend-btn"
          >
            Kirim Ulang Email
          </Button>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-semibold text-primary hover:underline underline-offset-4"
              data-testid="auth-forgot-back-to-login"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>
      ) : (
        <Formik<ForgotPasswordFormValues>
          initialValues={{ email: '' }}
          validate={validateWithZod(forgotPasswordSchema)}
          onSubmit={handleForgotSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" data-testid="auth-forgot-password-form">
              <FormController
                name="email"
                label="Alamat Email Terdaftar"
                type="email"
                required
                placeholder="nama@email.com"
                data-testid="auth-forgot-email"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
                data-testid="auth-forgot-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Mengirim Tautan...
                  </>
                ) : (
                  'Kirim Tautan Pemulihan'
                )}
              </Button>

              <div className="text-center pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline underline-offset-4"
                  data-testid="auth-forgot-back-link"
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
