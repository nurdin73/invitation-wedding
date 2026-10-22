# Spesifikasi Arsitektur & Struktur Folder Frontend (Next.js 15+ App Router)

Dokumen ini mendefinisikan struktur folder, modul, dan konvensi arsitektur frontend untuk aplikasi SaaS Undangan Online & Template Editor berbasis **Next.js 15+ (App Router)**, **TypeScript**, **shadcn/ui**, **Zustand**, **Tailwind CSS**, dan **Axios**.

---

## 1. Prinsip & Konvensi Arsitektur

1. **Strict Zone Separation:**
   * **Private Zone (`(dashboard)`):** Lingkungan SPA reaktif untuk Dashboard Pengguna dan Canvas Template Editor (Client-Side Rendering heavy).
   * **Public Zone (`(public)`):** Halaman tamu undangan (`/[slug]`) dengan performa tinggi berbasis Incremental Static Regeneration (ISR), dynamic OpenGraph, dan Core Web Vitals < 1.5s.

2. **UI Component Architecture (shadcn/ui standard):**
   * Seluruh komponen antarmuka dasar ditempatkan pada `src/components/ui/` mengikuti standar arsitektur dan CLI **shadcn/ui** (Button, Dialog, DropdownMenu, Tabs, Slider, Select, Popover, Input, Label, ScrollArea, dll.).
   * Menggunakan utility `src/lib/utils.ts` (`cn()` berbasis `clsx` dan `tailwind-merge`) serta `class-variance-authority` (CVA).

3. **Feature-Driven Modules (`src/modules/`):**
   * Komponen yang memiliki dependensi logika bisnis khusus diletakkan di dalam folder modul masing-masing (`editor`, `invitation-sections`, `guest-view`).
   * Komponen editor menggunakan primitif shadcn/ui sebagai blok pembangunnya.

4. **Domain-Isolated API Services Layer via Axios (`src/services/api/`):**
   * Seluruh komunikasi jaringan/HTTP menggunakan **Axios** terpusat di `src/lib/axios.ts` dengan interceptor token dan response unwrapper.
   * Setiap domain memiliki 1 file pemanggil API (misal: `invitations.api.ts`, `auth.api.ts`, `billing.api.ts`, `media.api.ts`, `public.api.ts`).
   * Komponen UI dan hook store **dilarang memanggil Axios secara mentah**, melainkan harus melalui fungsi terdefinisi di API service file masing-masing.

5. **Decoupled Styling:**
   * Desain dashboard dan editor menggunakan Tailwind semantic tokens shadcn (`background`, `foreground`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `border`).
   * Tampilan undangan menggunakan isolasi CSS Variables tersendiri (`--inv-*`) yang dinamis diinjeksi via style inline root canvas.

---

## 2. Struktur Pohon Direktori (Directory Tree)

```text
frontend/
├── public/
│   ├── fonts/                               # Font lokal opsional
│   ├── presets/                             # Thumbnail template preset
│   └── audio/                               # Soundtrack instrumen bawaan
│
├── src/
│   ├── app/                                 # Next.js App Router Root
│   │   ├── (auth)/                          # Route Group: Autentikasi
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/                     # Route Group: Panel Pengguna & Builder
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                 # Daftar undangan & ringkasan akun
│   │   │   ├── billing/
│   │   │   │   └── page.tsx                 # Status paket & riwayat pembayaran
│   │   │   ├── editor/
│   │   │   │   └── [id]/
│   │   │   │       ├── loading.tsx          # Skeleton loader canvas
│   │   │   │       └── page.tsx             # Entry Point Visual Template Editor
│   │   │   └── layout.tsx                   # Dashboard Sidebar & Navbar wrapper
│   │   │
│   │   ├── (public)/                        # Route Group: Halaman Tamu Undangan
│   │   │   └── [slug]/
│   │   │       ├── opengraph-image.tsx      # Dynamic Edge OpenGraph generator
│   │   │       ├── not-found.tsx            # Tampilan jika slug tidak valid / unpublished
│   │   │       ├── layout.tsx               # Minimal HTML reset layout
│   │   │       └── page.tsx                 # High-performance ISR Guest Page
│   │   │
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts                 # Webhook endpoint untuk On-Demand ISR cache purge
│   │   │
│   │   ├── globals.css                      # Design tokens shadcn, reset, & base layer
│   │   └── layout.tsx                       # Root Layout (Font inject & Sonner Toaster)
│   │
│   ├── components/                          # Komponen UI Global & Shared
│   │   ├── ui/                              # shadcn/ui Component Primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── select.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   └── sonner.tsx                   # Toast notification wrapper
│   │   └── feedback/
│   │       └── confirm-dialog.tsx           # shadcn Dialog wrapper untuk konfirmasi aksi
│   │
│   ├── services/                            # Central Network & API Integration Layer
│   │   └── api/                             # 1 File per Domain API Request (Axios-based)
│   │       ├── auth.api.ts                  # Login, Register, Logout, Session check
│   │       ├── invitations.api.ts           # CRUD Draft, Publish, Reorder, Fetch By ID
│   │       ├── media.api.ts                 # Presigned URL request & S3 upload execution
│   │       ├── billing.api.ts               # Checkout plan, check subscription status
│   │       └── public.api.ts                # Fetch public slug invitation & Submit RSVP
│   │
│   ├── modules/                             # Domain-Driven Feature Modules
│   │   │
│   │   ├── editor/                          # Fitur Visual Section Builder
│   │   │   ├── components/
│   │   │   │   ├── topbar/
│   │   │   │   │   ├── editor-topbar.tsx
│   │   │   │   │   ├── save-status-badge.tsx
│   │   │   │   │   └── device-preview-toggle.tsx
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── section-layer-list.tsx
│   │   │   │   │   ├── sortable-layer-item.tsx
│   │   │   │   │   ├── add-section-modal.tsx
│   │   │   │   │   └── global-theme-settings.tsx
│   │   │   │   ├── canvas/
│   │   │   │   │   ├── canvas-frame.tsx     # Mockup bingkai ponsel/tablet
│   │   │   │   │   ├── canvas-section-wrapper.tsx
│   │   │   │   │   └── section-reorder-dropzone.tsx
│   │   │   │   └── inspector/
│   │   │   │       ├── inspector-panel.tsx  # Sidebar kanan (Form setting section)
│   │   │   │       ├── layout-picker.tsx    # Ganti variasi layout section
│   │   │   │       └── content-fields/      # Form input per tipe section
│   │   │   │           ├── cover-fields.tsx
│   │   │   │           ├── profile-fields.tsx
│   │   │   │           ├── event-fields.tsx
│   │   │   │           └── gallery-fields.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-auto-save.ts         # Debounced auto-save hook
│   │   │   │   ├── use-editor-hotkeys.ts    # Shortcut Ctrl+Z, Ctrl+Y, Escape
│   │   │   │   └── use-drag-reorder.ts      # @dnd-kit sensor hooks
│   │   │   └── store/
│   │   │       ├── editor.store.ts          # Zustand store utama
│   │   │       └── editor.types.ts          # Type definition state kanvas
│   │   │
│   │   ├── invitation-sections/             # Komponen Section Template (Render Engine)
│   │   │   ├── registry.ts                  # Resolving Map: (type, variant) -> Component
│   │   │   ├── cover/
│   │   │   │   ├── cover-hero-full.tsx
│   │   │   │   └── cover-split-minimal.tsx
│   │   │   ├── couple-profile/
│   │   │   │   ├── profile-round-avatar.tsx
│   │   │   │   └── profile-editorial.tsx
│   │   │   ├── event-schedule/
│   │   │   │   ├── event-cards.tsx
│   │   │   │   └── event-timeline.tsx
│   │   │   ├── photo-gallery/
│   │   │   │   ├── gallery-grid.tsx
│   │   │   │   └── gallery-masonry.tsx
│   │   │   ├── rsvp-wishes/
│   │   │   │   └── rsvp-form-and-list.tsx
│   │   │   └── bank-envelope/
│   │   │       └── bank-envelope-card.tsx
│   │   │
│   │   └── guest-view/                      # Fitur Interaksi Tamu
│   │       ├── components/
│   │       │   ├── open-invitation-cover.tsx # Animasi amplop & trigger audio
│   │       │   ├── background-music-player.tsx
│   │       │   └── floating-action-menu.tsx # Navigasi cepat (Lokasi, Rekening, RSVP)
│   │       └── hooks/
│   │           └── use-invitation-sound.ts
│   │
│   ├── lib/                                 # Shared Utilities & Helpers
│   │   ├── utils.ts                         # shadcn cn() helper (clsx + tailwind-merge)
│   │   ├── axios.ts                         # Central Axios instance with Interceptors
│   │   ├── image-compressor.ts              # Browser-side canvas WebP converter
│   │   ├── font-loader.ts                   # Dynamic Google Font loader
│   │   ├── style-helpers.ts                 # CSS Variables generator
│   │   └── url-helpers.ts                   # WhatsApp link share formatter
│   │
│   └── types/                               # Global Type Definitions
│       ├── api.ts                           # Unified API response envelope type
│       ├── global.d.ts
│       └── next-auth.d.ts
│
├── components.json                          # Konfigurasi resmi shadcn/ui CLI
├── tailwind.config.ts                       # Token warna Tailwind + tailwindcss-animate
├── next.config.ts                           # Konfigurasi remote domain image (R2) & headers
├── package.json
└── tsconfig.json
```

---

## 3. Konfigurasi Client HTTP Axios (`src/lib/axios.ts`)

Axios dikonfigurasi secara sentral dengan interceptor untuk menangani kredensial cookie, JWT authorization token, dan serialisasi format response seragam (`meta`, `status`, `message`, `data`).

```typescript
// src/lib/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Kirim HttpOnly cookie ke Elysia backend
  timeout: 15000,
});

// Request Interceptor: Sisipkan bearer token jika tersimpan di memory/storage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error agar selalu conform ke ApiResponse<null>
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response?.data) {
      // Backend mengembalikan response envelope terstruktur
      return Promise.reject(error.response.data);
    }

    // Network error atau timeout
    const fallbackError: ApiResponse<null> = {
      meta: {
        code: 9001,
        timestamp: new Date().toISOString(),
      },
      status: 'FAILED',
      message: error.message || 'Tidak dapat terhubung ke server backend.',
      data: null,
    };

    return Promise.reject(fallbackError);
  }
);
```

---

## 4. Spesifikasi File API Service per Domain (`src/services/api/`)

Setiap file di `src/services/api/` membungkus instance `apiClient` Axios, mengembalikan tipe terstruktur `ApiResponse<T>`, dan menangani error secara deterministik.

### 4.1. `src/services/api/invitations.api.ts`
```typescript
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { SectionNode, ThemeConfig } from '@/modules/editor/store/editor.types';

export interface InvitationModel {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeConfig: ThemeConfig;
  sections: SectionNode[];
  isPublished: boolean;
  version: number;
}

export interface SaveDraftPayload {
  themeConfig: Record<string, unknown>;
  sections: unknown[];
}

export const invitationsApi = {
  async getById(id: string): Promise<ApiResponse<InvitationModel>> {
    const res = await apiClient.get<ApiResponse<InvitationModel>>(`/invitations/${id}`);
    return res.data;
  },

  async saveDraft(id: string, payload: SaveDraftPayload): Promise<ApiResponse<InvitationModel>> {
    const res = await apiClient.put<ApiResponse<InvitationModel>>(`/invitations/${id}/draft`, payload);
    return res.data;
  },

  async publish(id: string): Promise<ApiResponse<{ slug: string; publicUrl: string }>> {
    const res = await apiClient.post<ApiResponse<{ slug: string; publicUrl: string }>>(`/invitations/${id}/publish`);
    return res.data;
  }
};
```

### 4.2. `src/services/api/media.api.ts`
```typescript
import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { compressImageToWebP } from '@/lib/image-compressor';
import type { ApiResponse } from '@/types/api';

export interface PresignUploadPayload {
  filename: string;
  contentType: 'image/webp' | 'image/jpeg' | 'image/png' | 'audio/mpeg';
  byteSize: number;
  fileType: 'image' | 'audio';
}

export interface PresignResponseData {
  uploadUrl: string;
  publicCdnUrl: string;
  expiresIn: number;
}

export const mediaApi = {
  async requestPresignedUrl(payload: PresignUploadPayload): Promise<ApiResponse<PresignResponseData>> {
    const res = await apiClient.post<ApiResponse<PresignResponseData>>('/media/presign', payload);
    return res.data;
  },

  async uploadAsset(file: File, fileType: 'image' | 'audio'): Promise<string> {
    let uploadPayload: { blob: Blob; fileName: string; byteSize: number; contentType: any };

    if (fileType === 'image') {
      const compressed = await compressImageToWebP(file);
      uploadPayload = { ...compressed, contentType: 'image/webp' };
    } else {
      uploadPayload = { blob: file, fileName: file.name, byteSize: file.size, contentType: file.type };
    }

    // 1. Dapatkan Presigned URL dari backend Elysia via Axios
    const presignRes = await this.requestPresignedUrl({
      filename: uploadPayload.fileName,
      contentType: uploadPayload.contentType,
      byteSize: uploadPayload.byteSize,
      fileType
    });

    const { uploadUrl, publicCdnUrl } = presignRes.data!;

    // 2. Direct PUT binary stream ke Cloudflare R2 menggunakan instance axios terpisah (tanpa default interceptors)
    await axios.put(uploadUrl, uploadPayload.blob, {
      headers: {
        'Content-Type': uploadPayload.contentType,
      },
    });

    return publicCdnUrl;
  }
};
```

### 4.3. `src/services/api/billing.api.ts`
```typescript
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceIdr: number;
  durationDays: number;
  maxInvitations: number;
  maxGalleryPhotos: number;
}

export interface CheckoutResult {
  orderCode: string;
  snapToken?: string;
  redirectUrl?: string;
}

export const billingApi = {
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const res = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/billing/plans');
    return res.data;
  },

  async createCheckout(planId: string): Promise<ApiResponse<CheckoutResult>> {
    const res = await apiClient.post<ApiResponse<CheckoutResult>>('/billing/checkout', { planId });
    return res.data;
  },

  async getActiveSubscription(): Promise<ApiResponse<{ isActive: boolean; expiresAt: string | null }>> {
    const res = await apiClient.get<ApiResponse<{ isActive: boolean; expiresAt: string | null }>>('/billing/status');
    return res.data;
  }
};
```

### 4.4. `src/services/api/public.api.ts`
```typescript
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { InvitationModel } from './invitations.api';

export interface SubmitRsvpPayload {
  guestName: string;
  attendance: 'attending' | 'declined' | 'tentative';
  numberOfGuests: number;
  wishes?: string;
}

export const publicApi = {
  async getInvitationBySlug(slug: string): Promise<ApiResponse<InvitationModel>> {
    const res = await apiClient.get<ApiResponse<InvitationModel>>(`/public/${slug}`);
    return res.data;
  },

  async submitRsvp(slug: string, payload: SubmitRsvpPayload): Promise<ApiResponse<{ rsvpId: string }>> {
    const res = await apiClient.post<ApiResponse<{ rsvpId: string }>>(`/public/${slug}/rsvp`, payload);
    return res.data;
  }
};
```

### 4.5. `src/services/api/auth.api.ts`
```typescript
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export type UserRole = 'USER' | 'CONTRIBUTOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export const authApi = {
  async login(payload: { email: string; password: string }): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const res = await apiClient.post<ApiResponse<{ user: UserProfile; token: string }>>('/auth/login', payload);
    return res.data;
  },

  async register(payload: { fullName: string; email: string; password: string; role?: 'USER' | 'CONTRIBUTOR' }): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    const res = await apiClient.post<ApiResponse<{ user: UserProfile; token: string }>>('/auth/register', payload);
    return res.data;
  },

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const res = await apiClient.get<ApiResponse<UserProfile>>('/auth/me');
    return res.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return res.data;
  },

  async forgotPassword(payload: { email: string }): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', payload);
    return res.data;
  },

  async resetPassword(payload: { token: string; newPassword: string }): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload);
    return res.data;
  },

  async sendEmailVerification(): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>('/auth/verify-email/send');
    return res.data;
  },

  async confirmEmailVerification(payload: { token: string }): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>('/auth/verify-email/confirm', payload);
    return res.data;
  }
};
```
> **Catatan Keamanan Sesi**: Token otentikasi disimpan **eksklusif di HTTP Cookie** (`auth_token`), dibaca oleh Next.js Edge Middleware (`middleware.ts`), dan dipasok ke Axios via `getAuthCookie()`. `localStorage` hanya digunakan untuk cache presentasi profil non-sensitif (`auth_user`) dan dibersihkan otomatis saat logout via `clearAuthSession()`.


---

## 5. Auto-Save Hook dengan Axios Integration

```typescript
// src/modules/editor/hooks/use-auto-save.ts
'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editor.store';
import { invitationsApi } from '@/services/api/invitations.api';
import { toast } from 'sonner';

export function useAutoSave(delayMs = 1500) {
  const isDirty = useEditorStore((s) => s.isDirty);
  const invitationId = useEditorStore((s) => s.invitationId);
  const sections = useEditorStore((s) => s.sections);
  const theme = useEditorStore((s) => s.theme);
  const markSaved = useEditorStore((s) => s.markSaved);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isDirty || !invitationId) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        useEditorStore.setState({ isSaving: true });
        const res = await invitationsApi.saveDraft(invitationId, {
          themeConfig: theme as Record<string, unknown>,
          sections: sections as unknown[]
        });

        if (res.status === 'OK') {
          markSaved();
        }
      } catch (err: any) {
        toast.error(err.message || 'Gagal menyimpan draf otomatis.');
      } finally {
        useEditorStore.setState({ isSaving: false });
      }
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isDirty, sections, theme, invitationId, delayMs, markSaved]);
}
```