'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, Loader2, Heart, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormController } from '@/components/ui/form-controller';
import { AuthSocialButtons } from '@/components/auth/auth-social-buttons';
import { validateWithZod } from '@/lib/zod-formik';
import { authApi } from '@/services/api/auth.api';
import { saveAuthSession } from '@/lib/auth-session';
import { passwordComplexitySchema } from '@/lib/password-schema';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Nama lengkap wajib diisi.')
      .min(3, 'Nama lengkap minimal 3 karakter.'),
    email: z
      .string()
      .min(1, 'Alamat email wajib diisi.')
      .email('Format alamat email tidak valid.'),
    password: passwordComplexitySchema,
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi kata sandi wajib diisi.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok.',
    path: ['confirmPassword'],
  });


type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [selectedRole, setSelectedRole] = React.useState<'USER' | 'CONTRIBUTOR'>(
    roleParam === 'contributor' ? 'CONTRIBUTOR' : 'USER'
  );

  React.useEffect(() => {
    if (roleParam === 'contributor') {
      setSelectedRole('CONTRIBUTOR');
    }
  }, [roleParam]);

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await authApi.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: selectedRole,
      });

      if (response.data?.token && response.data?.user) {
        saveAuthSession(response.data.token, response.data.user);
        toast.success('Pendaftaran berhasil! Kami telah mengirim tautan verifikasi ke email Anda.');
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
          {selectedRole === 'CONTRIBUTOR' ? 'Daftar Kontributor Desain' : 'Buat Akun Baru'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {selectedRole === 'CONTRIBUTOR'
            ? 'Publikasikan karya template undangan Anda dan peroleh pendapatan bagi hasil (revenue share) secara transparan.'
            : 'Mulai rancang undangan digital pernikahan impian Anda dengan template elegan dan fitur interaktif lengkap.'}
        </p>
      </div>

      {/* Role Persona Switcher Tabs */}
      <div
        className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-card-oat border border-border"
        data-testid="auth-register-role-tabs"
      >
        <button
          type="button"
          onClick={() => setSelectedRole('USER')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            selectedRole === 'USER'
              ? 'bg-card text-foreground shadow-xs border border-border/60'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          data-testid="auth-register-role-user-tab"
        >
          <Heart className={`h-3.5 w-3.5 ${selectedRole === 'USER' ? 'text-primary' : ''}`} />
          <span>Calon Pengantin</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('CONTRIBUTOR')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            selectedRole === 'CONTRIBUTOR'
              ? 'bg-card text-foreground shadow-xs border border-border/60'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          data-testid="auth-register-role-contributor-tab"
        >
          <Palette className={`h-3.5 w-3.5 ${selectedRole === 'CONTRIBUTOR' ? 'text-primary' : ''}`} />
          <span>Kontributor Desain</span>
        </button>
      </div>

      <Formik<RegisterFormValues>
        initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
        validate={validateWithZod(registerSchema)}
        onSubmit={handleRegisterSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4" data-testid="auth-register-form">
            <FormController
              name="fullName"
              label="Nama Lengkap"
              required
              placeholder={selectedRole === 'CONTRIBUTOR' ? 'Contoh: Alex Pratama (Studio Desain)' : 'Contoh: Sarah Jenkins'}
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
              placeholder="Min. 8 karakter (huruf besar, angka & simbol)"
              data-testid="auth-register-password"
            />


            <FormController
              name="confirmPassword"
              label="Konfirmasi Kata Sandi"
              type="password"
              required
              placeholder="Masukkan ulang kata sandi"
              data-testid="auth-register-confirm-password"
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
                  {selectedRole === 'CONTRIBUTOR' ? 'Daftar Sebagai Kontributor' : 'Mulai Sekarang'}
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

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-md mx-auto py-12 text-center text-sm text-muted-foreground">Memuat formulir pendaftaran...</div>}>
      <RegisterFormContent />
    </React.Suspense>
  );
}
