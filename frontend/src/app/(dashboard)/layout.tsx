'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
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
            <Link href="/dashboard" className="font-semibold text-foreground tracking-tight">
              💍 Wedding SaaS
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
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="dashboard-logout-btn">
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 container mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
