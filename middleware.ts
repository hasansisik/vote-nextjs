import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard routes that should bypass locale prefix completely
  if (pathname.startsWith('/dashboard')) {
    // Allow access to dashboard without locale prefix
    // Authentication will be handled by the dashboard layout
    return NextResponse.next();
  }

  // Handle internationalization for all other routes
  const intlResponse = intlMiddleware(request);
  
  // Public routes that don't require authentication (without locale prefix)
  const publicRoutes = [
    '/',
    '/giris',
    '/kayit-ol',
    '/sifre-sifirla',
    '/sifremi-unuttum',
    '/dogrulama',
    '/email-dogrula',
    '/hakkimizda',
    '/gizlilik-politikasi',
    '/kullanim-sartlari',
    '/api',
    '/_next',
    '/favicon.ico',
    '/oylamalar',
    '/kategoriler',
    '/test',
    '/category',
    '/vote',
    '/arama',
    '/bildirimler',
    '/kategori',
    '/menu',
    '/profil',
    '/dashboard' // Dashboard routes should not have locale prefix
  ];

  // Extract pathname without locale
  const pathnameWithoutLocale = pathname.replace(/^\/(tr|en|de|fr)/, '') || '/';

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return intlResponse;
  }

  // Check if user is authenticated by looking for accessToken in cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!accessToken && !isPublicRoute) {
    const locale = pathname.match(/^\/(tr|en|de|fr)/)?.[1] || 'tr';
    const loginUrl = new URL(`/${locale}/giris`, request.url);
    loginUrl.searchParams.set('redirect', pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
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
