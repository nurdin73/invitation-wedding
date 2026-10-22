'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { AuthSocialButtons } from '@/components/auth/auth-social-buttons';
import { validateWithZod } from '@/lib/zod-formik';
import { authApi } from '@/services/api/auth.api';
import { saveAuthSession } from '@/lib/auth-session';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Alamat email wajib diisi.')
    .email('Format alamat email tidak valid.'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi.')
    .min(6, 'Kata sandi minimal 6 karakter.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await authApi.login(values);
      if (response.data?.token && response.data?.user) {
        // Simpan token eksklusif di Cookie & profil non-sensitif di localStorage
        saveAuthSession(response.data.token, response.data.user);
        toast.success('Login berhasil! Mengalihkan ke dashboard...');
        router.push(redirectTarget);
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Kombinasi email atau kata sandi tidak cocok.'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="auth-login-container">
      {/* Brand Glyph & Header */}
      <div className="space-y-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Selamat Datang Kembali
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Akses akun Anda untuk mengelola undangan, memantau RSVP tamu, atau mempublikasikan karya desain Anda.
        </p>
      </div>

      <Formik<LoginFormValues>
        initialValues={{ email: '', password: '' }}
        validate={validateWithZod(loginSchema)}
        onSubmit={handleLoginSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4" data-testid="auth-login-form">
            <FormController
              name="email"
              label="Alamat Email"
              type="email"
              required
              placeholder="nama@email.com"
              data-testid="auth-login-email"
            />

            <div className="space-y-1.5">
              <FormController
                name="password"
                label="Kata Sandi"
                type="password"
                required
                placeholder="Masukkan kata sandi"
                data-testid="auth-login-password"
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  data-testid="auth-login-forgot-password-link"
                >
                  Lupa kata sandi?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
              data-testid="auth-login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Memproses Masuk...
                </>
              ) : (
                <>
                  Masuk ke Akun
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            {/* Social Authentication */}
            <AuthSocialButtons />

            {/* Footer Navigation Link */}
            <div className="text-center text-xs text-muted-foreground pt-4">
              Belum memiliki akun?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline underline-offset-4"
                data-testid="auth-login-to-register-link"
              >
                Daftar Sekarang
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-md mx-auto py-12 text-center text-sm text-muted-foreground">Memuat formulir masuk...</div>}>
      <LoginFormContent />
    </React.Suspense>
  );
}
