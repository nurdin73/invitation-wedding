'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type UserProfile } from '@/services/api/auth.api';
import { getStoredUser, updateStoredUser, clearAuthSession } from '@/lib/auth-session';
import { EmailVerificationBanner } from '@/components/dashboard/email-verification-banner';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardBreadcrumbBar } from '@/components/dashboard/dashboard-breadcrumb-bar';

const SIDEBAR_COLLAPSED_KEY = 'wedding_invitation_sidebar_collapsed';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Inisialisasi status collapse dari localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia (SSR/Privacy Mode)
    }
  }, []);

  // Simpan status collapse ke localStorage saat berubah
  const handleToggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // Abaikan jika storage error
      }
      return next;
    });
  }, []);

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
      clearAuthSession();
      router.push('/login');
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex bg-background text-foreground"
      data-testid="dashboard-fixed-viewport"
    >
      {/* Fixed Collapsible Sidebar */}
      <DashboardSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        user={user}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Fixed Topbar Header */}
        <DashboardHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setIsMobileOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Fixed Dynamic Breadcrumb & Action Bar */}
        <DashboardBreadcrumbBar />

        {/* Scrollable Main Workspace Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 w-full"
          data-testid="dashboard-scrollable-content"
        >
          <EmailVerificationBanner user={user} />
          {children}
        </main>
      </div>
    </div>
  );
}
