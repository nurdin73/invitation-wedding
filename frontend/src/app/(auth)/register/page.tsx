'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { AuthSocialButtons } from '@/components/auth/auth-social-buttons';
import { validateWithZod } from '@/lib/zod-formik';
import { authApi } from '@/services/api/auth.api';

const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nama lengkap wajib diisi.')
    .min(3, 'Nama lengkap minimal 3 karakter.'),
  email: z
    .string()
    .min(1, 'Alamat email wajib diisi.')
    .email('Format alamat email tidak valid.'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi.')
    .min(8, 'Kata sandi minimal 8 karakter.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await authApi.register(values);
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        toast.success('Pendaftaran berhasil! Mengalihkan ke dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Pendaftaran gagal. Silakan coba lagi.'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6" data-testid="auth-register-container">
      {/* Brand Glyph & Header */}
      <div className="space-y-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Buat Akun Baru
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Mulai rancang undangan digital pernikahan impian Anda dengan template elegan dan fitur interaktif lengkap.
        </p>
      </div>

      <Formik<RegisterFormValues>
        initialValues={{ fullName: '', email: '', password: '' }}
        validate={validateWithZod(registerSchema)}
        onSubmit={handleRegisterSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4" data-testid="auth-register-form">
            <FormController
              name="fullName"
              label="Nama Lengkap"
              required
              placeholder="Contoh: Sarah Jenkins"
              data-testid="auth-register-name"
            />

            <FormController
              name="email"
              label="Alamat Email"
              type="email"
              required
              placeholder="nama@email.com"
              data-testid="auth-register-email"
            />

            <FormController
              name="password"
              label="Kata Sandi"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              data-testid="auth-register-password"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/20 transition-all hover:shadow-primary/30"
              data-testid="auth-register-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Mendaftarkan Akun...
                </>
              ) : (
                <>
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            {/* Social Authentication */}
            <AuthSocialButtons />

            {/* Footer Navigation Link */}
            <div className="text-center text-xs text-muted-foreground pt-4">
              Sudah memiliki akun?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline underline-offset-4"
                data-testid="auth-register-to-login-link"
              >
                Masuk di sini
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
