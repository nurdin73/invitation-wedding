'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Palette, Heart, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { authApi, type UserProfile } from '@/services/api/auth.api';
import { getStoredUser, updateStoredUser, clearAuthSession } from '@/lib/auth-session';
import { EmailVerificationBanner } from '@/components/dashboard/email-verification-banner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    // 1. Ambil data tersimpan dari localStorage untuk render instan
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    // 2. Refresh profile data di background dari API backend
    authApi
      .getProfile()
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          updateStoredUser(res.data);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat profil terbaru:', err);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Panggilan logout API gagal, melanjutkan pembersihan sesi lokal:', err);
    } finally {
      // Hapus token eksklusif dari Cookie dan profil dari localStorage
      clearAuthSession();
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Undangan Saya', href: '/dashboard' },
    { label: 'Paket & Tagihan', href: '/billing' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Topbar Navigation */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-semibold text-foreground tracking-tight flex items-center gap-2"
              data-testid="dashboard-brand-logo"
            >
              <span>💍 {siteConfig.name}</span>
            </Link>
            <nav className="flex items-center gap-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid={`dashboard-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div
                className="hidden sm:flex items-center gap-2 pr-2 border-r border-border"
                data-testid="dashboard-user-profile-badge"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground line-clamp-1">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    {user.role === 'CONTRIBUTOR' ? (
                      <>
                        <Palette className="h-2.5 w-2.5 text-primary" />
                        Kontributor Desain
                      </>
                    ) : (
                      <>
                        <Heart className="h-2.5 w-2.5 text-primary" />
                        Calon Pengantin
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5"
              data-testid="dashboard-logout-btn"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 container mx-auto p-4 sm:p-6">
        <EmailVerificationBanner user={user} />
        {children}
      </main>
    </div>
  );
}
