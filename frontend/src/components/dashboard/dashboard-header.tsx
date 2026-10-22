'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Palette,
  Heart,
  Sparkles,
  User,
  KeyRound,
  ChevronDown,
  ShieldCheck,
  Calendar,
  X,
} from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { siteConfig } from '@/config/site';
import type { UserProfile } from '@/services/api/auth.api';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export function DashboardHeader({
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
  user,
  onLogout,
}: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(false);

  return (
    <>
      <header
        className="h-14 border-b border-border bg-card flex-shrink-0 flex items-center justify-between px-4 sm:px-6 z-20"
        data-testid="dashboard-header"
      >
        {/* Sisi Kiri: Tombol Collapse Sidebar (Desktop) & Menu Drawer (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Tombol Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobile}
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Buka menu navigasi"
            data-testid="dashboard-header-mobile-toggle"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Tombol Collapse Desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden md:inline-flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            data-testid="dashboard-sidebar-collapse-toggle"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          {/* Logo Brand untuk Layar Ponsel */}
          <div className="md:hidden flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 transition-opacity hover:opacity-90"
              data-testid="dashboard-header-mobile-brand"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-sans text-sm font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
            </Link>
          </div>
        </div>

        {/* Sisi Kanan: User Profile Dropdown Menu */}
        <div className="flex items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-muted/70 transition-colors outline-none focus:ring-1 focus:ring-ring text-left"
                  data-testid="dashboard-header-user-dropdown-trigger"
                  aria-label="Menu akun pengguna"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground line-clamp-1 max-w-[130px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      {user.role === 'CONTRIBUTOR' ? (
                        <>
                          <Palette className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                          Kontributor
                        </>
                      ) : (
                        <>
                          <Heart className="h-2.5 w-2.5 text-primary flex-shrink-0" />
                          Pengantin
                        </>
                      )}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56"
                data-testid="dashboard-header-user-dropdown-content"
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-semibold leading-none text-foreground truncate">
                      {user.fullName}
                    </p>
                    <p className="text-[11px] leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Item 1: Profil Saya */}
                <DropdownMenuItem
                  onClick={() => setIsProfileOpen(true)}
                  className="cursor-pointer gap-2"
                  data-testid="dashboard-user-dropdown-profile"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>

                {/* Item 2: Ubah Password */}
                <DropdownMenuItem
                  onClick={() => setIsPasswordOpen(true)}
                  className="cursor-pointer gap-2"
                  data-testid="dashboard-user-dropdown-change-password"
                >
                  <KeyRound className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span>Ubah Password</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Item 3: Keluar */}
                <DropdownMenuItem
                  onClick={onLogout}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  data-testid="dashboard-user-dropdown-logout"
                >
                  <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Modal Dialog: Profil Saya */}
      {user && (
        <DialogPrimitive.Root open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity" />
            <DialogPrimitive.Content
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-xl sm:rounded-xl"
              data-testid="dashboard-profile-dialog"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <DialogPrimitive.Title className="text-base font-semibold text-foreground">
                      Profil Pengguna
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-xs text-muted-foreground">
                      Informasi akun dan hak akses Anda
                    </DialogPrimitive.Description>
                  </div>
                </div>
                <DialogPrimitive.Close asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogPrimitive.Close>
              </div>

              <div className="space-y-3 py-2 text-xs">
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nama Lengkap</span>
                    <span className="font-semibold text-foreground">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Alamat Email</span>
                    <span className="font-semibold text-foreground font-mono">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Peran Akun</span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[11px]">
                      {user.role === 'CONTRIBUTOR' ? 'Kontributor Desain' : 'Calon Pengantin'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status Email</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {user.isEmailVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setIsProfileOpen(false)}>
                  Tutup
                </Button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}

      {/* Modal Dialog: Ubah Password */}
      {user && (
        <DialogPrimitive.Root open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity" />
            <DialogPrimitive.Content
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-card p-6 shadow-xl sm:rounded-xl"
              data-testid="dashboard-change-password-dialog"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <DialogPrimitive.Title className="text-base font-semibold text-foreground">
                      Ubah Kata Sandi
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-xs text-muted-foreground">
                      Perbarui kata sandi akun Anda untuk menjaga keamanan
                    </DialogPrimitive.Description>
                  </div>
                </div>
                <DialogPrimitive.Close asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogPrimitive.Close>
              </div>

              <div className="space-y-3 py-2 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  Untuk keamanan akun Anda, tautan pembaruan kata sandi dapat dikirimkan langsung ke email resmi terdaftar:{' '}
                  <span className="font-semibold text-foreground font-mono">{user.email}</span>.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPasswordOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    toast.success(`Tautan ubah kata sandi telah dikirim ke ${user.email}`);
                    setIsPasswordOpen(false);
                  }}
                >
                  Kirim Tautan Reset
                </Button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </>
  );
}
