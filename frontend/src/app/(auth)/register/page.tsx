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
    <Formik<RegisterFormValues>
      initialValues={{ fullName: '', email: '', password: '' }}
      validate={validateWithZod(registerSchema)}
      onSubmit={handleRegisterSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4" data-testid="auth-register-form">
          {/* type tidak didefinisikan -> otomatis fallback ke 'text' */}
          <FormController
            name="fullName"
            label="Nama Lengkap"
            required
            placeholder="Nama Anda"
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
            label="Kata Sandi (Min. 8 Karakter)"
            type="password"
            required
            placeholder="••••••••"
            data-testid="auth-register-password"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            data-testid="auth-register-submit-btn"
          >
            {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
