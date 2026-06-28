import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/verify-email') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password');
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // Redirect logged-in users away from auth pages to dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Redirect logged-out users trying to access protected routes to login
  if (isProtectedRoute && !isLoggedIn) {
    let from = pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Run proxy on all routes except API, Next.js internal, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
