import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isAdmin, getUserRoleFromToken } from './lib/admin-utils';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle multilingual category routes - redirect to appropriate language folder
  const categoryTranslations = {
    'tr': 'kategori',
    'en': 'category', 
    'de': 'kategorie',
    'fr': 'categorie'
  };

  // Check if the path contains a translated category route and redirect to the correct language folder
  for (const [locale, categoryPath] of Object.entries(categoryTranslations)) {
    const categoryRegex = new RegExp(`^/${locale}/${categoryPath}(/.*)?$`);
    if (categoryRegex.test(pathname)) {
      // Keep the same path structure but ensure it uses the correct language folder
      // No redirect needed - let it go to the actual folder
      break;
    }
  }

  // Dashboard routes that should bypass locale prefix completely
  if (pathname.startsWith('/dashboard')) {
    // Check if user is authenticated by looking for accessToken in cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    
    // If no token, redirect to home page instead of login
    if (!accessToken) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    
    // Decode token to check role
    const userRole = getUserRoleFromToken(accessToken);
    
    // Only allow admin and moderator roles to access dashboard
    if (!isAdmin(userRole || undefined)) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    
    // Allow access to dashboard without locale prefix
    return NextResponse.next();
  }

  // Handle internationalization for all other routes
  const intlResponse = intlMiddleware(request);
  
  // Add preferred language header from cookie if available
  const preferredLanguage = request.cookies.get('preferred-language')?.value;
  if (preferredLanguage) {
    intlResponse.headers.set('x-preferred-language', preferredLanguage);
  }
  
  // Public routes that don't require authentication (without locale prefix)
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/reset-password',
    '/forgot-password',
    '/verification',
    '/email-dogrula',
    '/about',
    '/privacy-policy',
    '/terms',
    '/api',
    '/_next',
    '/static', // Static files should not have locale prefix
    '/favicon.ico',
    '/oylamalar',
    '/kategoriler',
    '/test',
    '/vote',
    '/search',
    '/notifications',
    '/menu',
    '/profile',
    // Multilingual category routes
    '/kategori',
    '/category',
    '/kategorie',
    '/categorie'
    // Dashboard routes are handled separately above and require authentication
  ];

  // Check if the path is a test slug (contains hyphens and lowercase letters/numbers)
  const isTestSlug = (path: string) => {
    // Remove leading slash
    const cleanPath = path.replace(/^\//, '');
    // Check if it matches slug pattern: lowercase letters, numbers, and hyphens
    return /^[a-z0-9-]+$/.test(cleanPath) && cleanPath.length > 0;
  };

  // Extract pathname without locale
  const pathnameWithoutLocale = pathname.replace(/^\/(tr|en|de|fr)/, '') || '/';

  // Check if the current path is a public route or a test slug
  const isPublicRoute = publicRoutes.some(route => 
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route)
  ) || isTestSlug(pathnameWithoutLocale);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return intlResponse;
  }

  // Check if user is authenticated by looking for accessToken in cookies
  const accessToken = request.cookies.get('accessToken')?.value;

  // If no token and trying to access protected route, redirect to home
  if (!accessToken && !isPublicRoute) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
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
     * - static (public static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|static|favicon.ico).*)',
  ],
};
