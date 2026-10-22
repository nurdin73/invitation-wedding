# Technical Specification Document (TSD): Authentication, Authorization, Contributor Role & Cookie-Exclusive Session Architecture

## 1. Executive Summary & Objective

Dokumen ini mendefinisikan spesifikasi teknis arsitektur (*Technical Specification Document* / TSD) subsistem **Autentikasi & Otorisasi End-to-End** pada platform SaaS Undangan Pernikahan Digital:
1. **Single Source of Truth Kredensial**: Token autentikasi JWT (`auth_token`) disimpan **EKSKLUSIF HANYA DI HTTP COOKIE** (tidak boleh disimpan di `localStorage`).
2. **Pemanfaatan `localStorage`**: Dibatasi **hanya** untuk *cache* presentasi profil pengguna non-sensitif (`auth_user`: `{ id, fullName, email, role, isEmailVerified }`) untuk kebutuhan rendering instan di UI dashboard tanpa layout shift.
3. **Pembersihan Terpusat Saat Logout**: Menghapus cookie `auth_token` dan `auth_role` (`max-age=0`), serta menghapus `auth_user` dari `localStorage`.
4. **Keselarasan 1:1 Kontributor**: Integrasi opsi registrasi kontributor dari landing page (`/register?role=contributor`), penambahan kolom `role` pada skema basis data, dan adaptasi formulir registrasi dual-persona.
5. **Proteksi Multi-Layer & RBAC**:
   - **Frontend Guard**: Next.js Edge Middleware (`middleware.ts`) membaca cookie `auth_token` dan `auth_role` untuk memproteksi rute `/dashboard/*` serta mencegah user biasa mengakses rute khusus kontributor.
   - **Backend Guard**: ElysiaJS `authMacro` dengan macro `isAuth` dan `requireRole` yang memblokir akses ilegal dengan HTTP 403 (`2003 FORBIDDEN_RESOURCE`).
6. **Pemulihan Akun & Verifikasi Email**:
   - Forgot Password & Reset Password menggunakan token acak 64 karakter ber-hash SHA-256 (kadaluarsa 1 jam).
   - Verifikasi Email ber-hash SHA-256 (kadaluarsa 24 jam) via SMTP Nodemailer.

---

## 2. Kebijakan Penyimpanan Sesi: Cookie Eksklusif vs `localStorage`

### A. Alasan Pemisahan Tanggung Jawab (Separation of Concerns)

| Media Penyimpanan | Data yang Disimpan | Sifat & Alasan Penggunaan |
| :--- | :--- | :--- |
| **HTTP Cookie** | `auth_token`, `auth_role` | **EKSKLUSIF untuk Kredensial & Otorisasi.**<br>1. Dibaca langsung oleh Next.js Edge Middleware di server sebelum halaman di-render.<br>2. Tidak rentan terhadap script pihak ketiga yang membaca seluruh `localStorage`.<br>3. Menghindari anti-pattern duplikasi token di dua tempat. |
| **`localStorage`** | `auth_user` (JSON Profil) | **HANYA untuk Cache Presentasi UI.**<br>1. Berisi data non-sensitif (`fullName`, `email`, `role`, `isEmailVerified`).<br>2. Digunakan oleh komponen topbar dashboard untuk merender nama, inisial avatar, dan badge peran secara instan tanpa menunggu network request.<br>3. **Dilarang keras menyimpan token kredensial di sini.** |

### B. Alur Interceptor Axios (`frontend/src/lib/axios.ts`)
Interceptor permintaan Axios membaca token autentikasi **langsung dari cookie**, bukan dari `localStorage`:
```typescript
import { getAuthCookie } from './auth-session';

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAuthCookie(); // Membaca dari document.cookie
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### C. Alur Pembersihan Otomatis Saat Logout
Saat fungsi logout dipanggil:
1. Memanggil endpoint backend `POST /api/v1/auth/logout` (dengan Authorization header).
2. Menghapus cookie `auth_token` dan `auth_role` (`path=/; max-age=0; SameSite=Lax`).
3. Menghapus `auth_user` dari `localStorage` (`localStorage.removeItem('auth_user')`).
4. Mengarahkan pengguna ke `/login`.

---

## 3. Spesifikasi Basis Data (`backend/src/db/schema/`)

### A. Skema `users` (`users.schema.ts`)
```typescript
import { pgTable, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const userRoleEnum = ['USER', 'CONTRIBUTOR', 'ADMIN'] as const;
export type UserRole = (typeof userRoleEnum)[number];

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 32 }).$type<UserRole>().default('USER').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### B. Skema Baru `auth_tokens` (`auth_tokens.schema.ts`)
```typescript
import { pgTable, text, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const authTokenTypeEnum = ['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const;
export type AuthTokenType = (typeof authTokenTypeEnum)[number];

export const authTokens = pgTable(
  'auth_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: text('token_hash').notNull(),
    type: varchar('type', { length: 32 }).$type<AuthTokenType>().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenHashIdx: index('idx_auth_tokens_hash').on(table.tokenHash),
    userIdTypeIdx: index('idx_auth_tokens_user_type').on(table.userId, table.type),
  })
);

export type AuthToken = typeof authTokens.$inferSelect;
export type NewAuthToken = typeof authTokens.$inferInsert;
```

---

## 4. Backend Hexagonal Topology & RBAC Guarding

### A. Kontrak Service (`backend/src/services/auth.service.ts`)
```typescript
import type { UserRole } from '../db/schema/users.schema';

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface VerifyEmailConfirmDTO {
  token: string;
}

export interface UserProfileDTO {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface AuthResult {
  user: UserProfileDTO;
  token: string;
}

export interface IAuthService {
  register(payload: RegisterDTO): Promise<AuthResult>;
  login(payload: LoginDTO): Promise<AuthResult>;
  getProfile(userId: string): Promise<UserProfileDTO>;
  logout(userId: string): Promise<void>;
  requestPasswordReset(payload: ForgotPasswordDTO): Promise<void>;
  resetPassword(payload: ResetPasswordDTO): Promise<void>;
  sendEmailVerification(userId: string): Promise<void>;
  verifyEmail(payload: VerifyEmailConfirmDTO): Promise<void>;
}
```

### B. Elysia Macro Guard (`backend/src/inbound/http/middlewares/auth.macro.ts`)
Mendukung verifikasi autentikasi (`isAuth`) dan pemeriksaan peran (`requireRole`):
```typescript
export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
}
```

---

## 5. Frontend Session & Next.js Guard Architecture

- Helper terpusat `frontend/src/lib/auth-session.ts` (`saveAuthSession`, `getAuthCookie`, `getStoredUser`, `clearAuthSession`).
- Next.js Edge Middleware `frontend/src/middleware.ts` memproteksi rute `/dashboard/*`, `/editor/*`, `/billing/*` dan mengalihkan user biasa jika mencoba membuka rute khusus kontributor.
