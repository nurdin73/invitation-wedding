import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('auth_role')?.value;

  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/editor') ||
    pathname.startsWith('/billing');

  const isAuthPath =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  // 1. Guard Rute Terproteksi
  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role Guard: Cegah user biasa mengakses rute khusus kontributor
    if (pathname.startsWith('/dashboard/contributor') && role !== 'CONTRIBUTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Cegah pengguna yang sudah terotentikasi membuka rute auth
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/billing/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
