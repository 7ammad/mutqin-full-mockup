import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes: Record<string, string> = {
  '/dashboard/organizer': 'ORGANIZER',
  '/dashboard/vendor': 'VENDOR',
  '/dashboard/regulator': 'REGULATOR',
  '/dashboard/hcp': 'HCP',
  '/dashboard/event-manager': 'EVENT_MANAGER',
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/register',
  '/register/hcp',
  '/register/organizer',
  '/register/event-manager',
  '/register/sponsor',
  '/register/regulator',
  '/register/verify',
  '/reset-password',
  '/reset-password/confirm',
  '/onboarding',
  '/onboarding/hcp',
  '/onboarding/organizer',
  '/onboarding/event-manager',
  '/onboarding/vendor',
  '/onboarding/regulator',
  '/pricing',
  '/faq',
  '/privacy',
  '/terms',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/events',
  '/events/browse',
  '/events/search',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes, API routes, static files, and Next.js internals
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });

  if (
    isPublicRoute ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next();
  }
  
  // Check if route is protected
  const requiredRole = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  if (requiredRole) {
    // Check for auth session in cookie
    const sessionCookie = request.cookies.get('auth_session');
    
    if (!sessionCookie) {
      // Redirect to login with return URL
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      console.log(`[Proxy] No session, redirecting to login from ${pathname}`);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session expired
      if (session.expiresAt < Date.now()) {
        const loginUrl = new URL('/auth/login', request.url);
        console.log(`[Proxy] Session expired, redirecting to login`);
        return NextResponse.redirect(loginUrl);
      }

      // Check if user has required role
      if (session.role !== requiredRole) {
        // Redirect to their dashboard
        const slug = session.role.toLowerCase().replace('_', '-');
        console.log(`[Proxy] Role mismatch, redirecting to /dashboard/${slug}`);
        return NextResponse.redirect(
          new URL(`/dashboard/${slug}`, request.url)
        );
      }
    } catch (e) {
      // Invalid session
      const loginUrl = new URL('/auth/login', request.url);
      console.log(`[Proxy] Invalid session, redirecting to login: ${(e as Error).message}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run proxy on
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

