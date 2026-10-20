'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi } from '@/services/api/auth.api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        toast.success('Login berhasil! Mengalihkan ke dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Kombinasi email atau kata sandi tidak cocok.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="auth-login-form">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Alamat Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="auth-login-email-input"
          placeholder="nama@email.com"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Kata Sandi
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="auth-login-password-input"
          placeholder="••••••••"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        data-testid="auth-login-submit-btn"
      >
        {isLoading ? 'Memproses Masuk...' : 'Masuk ke Akun'}
      </Button>

      <div className="text-center text-xs text-muted-foreground pt-2">
        Belum memiliki akun?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Daftar Sekarang
        </Link>
      </div>
    </form>
  );
}
