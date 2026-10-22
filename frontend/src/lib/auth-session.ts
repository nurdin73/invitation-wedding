import type { UserProfile } from '@/services/api/auth.api';

const TOKEN_COOKIE = 'auth_token';
const ROLE_COOKIE = 'auth_role';
const USER_PROFILE_KEY = 'auth_user';

/**
 * Menyimpan sesi: Token EKSKLUSIF ke Cookie, Profil non-sensitif ke localStorage
 */
export function saveAuthSession(token: string, user: UserProfile): void {
  if (typeof window === 'undefined') return;

  // 1. Token kredensial HANYA disimpan di Cookie (masa berlaku 7 hari)
  const isSecure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${isSecure}`;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; max-age=604800; SameSite=Lax${isSecure}`;

  // 2. localStorage HANYA untuk cache presentasi profil UI
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));

  // Pastikan legacy auth_token di localStorage dibersihkan agar tidak ada duplikasi
  localStorage.removeItem('auth_token');
}

/**
 * Mengambil token otentikasi dari cookie
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + TOKEN_COOKIE + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Mengambil peran (role) dari cookie
 */
export function getAuthRoleCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + ROLE_COOKIE + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Mengambil profil user yang tersimpan di localStorage
 */
export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Memperbarui profil user di localStorage tanpa mengubah token
 */
export function updateStoredUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  const isSecure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; max-age=604800; SameSite=Lax${isSecure}`;
}

/**
 * Menghapus token dari cookie dan profil dari localStorage saat logout
 */
export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  // Hapus cookie kredensial
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;

  // Hapus cache profil dari localStorage
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem('auth_token');
}
