import { NextResponse, NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/settings', '/learn', '/practice', '/exam', '/community', '/shop'];

// Add paths that are only for guest users (login, register, etc.)
const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];
  const { pathname } = request.nextUrl;

  // 1. Check if the path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  
  // 2. Check if the path is for auth (login/register)
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
