'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { validateWithZod } from '@/lib/zod-formik';
import { authApi } from '@/services/api/auth.api';

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

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await authApi.login(values);
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        toast.success('Login berhasil! Mengalihkan ke dashboard...');
        router.push('/dashboard');
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

          <FormController
            name="password"
            label="Kata Sandi"
            type="password"
            required
            placeholder="••••••••"
            data-testid="auth-login-password"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            data-testid="auth-login-submit-btn"
          >
            {isSubmitting ? 'Memproses Masuk...' : 'Masuk ke Akun'}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Belum memiliki akun?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Daftar Sekarang
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
