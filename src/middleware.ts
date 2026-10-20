import { NextResponse, type NextRequest } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rate-limit';
import { logRateLimitTrigger, logBotBlocked } from '@/lib/audit/logger';

// Known commercial LLM crawlers & unapproved scrapers
const KNOWN_SCRAPERS = [
  'gptbot',
  'chatgpt-user',
  'ccbot',
  'claudebot',
  'anthropic-ai',
  'bytespider',
  'petalbot',
  'omgilibot',
  'diffbot',
  'scrapy',
  'cohere-ai',
  'perplexitybot',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  // Extract client IP address securely
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 1. Anti-Scraping / Bot Defense: Block known AI scrapers from internal & API routes
  const isKnownScraper = KNOWN_SCRAPERS.some((bot) => userAgent.includes(bot));
  if (isKnownScraper) {
    const isSensitive =
      pathname.startsWith('/api') ||
      pathname.startsWith('/operator') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/portal') ||
      pathname.startsWith('/checkout');

    if (isSensitive) {
      logBotBlocked(ip, userAgent, pathname);
      return new NextResponse('Access denied: Automated crawlers prohibited on protected routes.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
  }

  // 2. Edge Rate Limiting on Sensitive API Endpoints
  if (pathname.startsWith('/api')) {
    let limit = 60;
    let windowMs = 60_000;

    if (pathname.startsWith('/api/contact')) {
      limit = 5; // Max 5 inquiries per minute
    } else if (pathname.startsWith('/api/checkout')) {
      limit = 15; // Max 15 checkout attempts per minute
    } else if (pathname.startsWith('/api/members/register')) {
      limit = 10; // Max 10 registrations per minute
    }

    const rateResult = checkRateLimit(`${ip}:${pathname}`, limit, windowMs);

    if (!rateResult.success) {
      logRateLimitTrigger(ip, pathname, rateResult.remaining);
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many requests. Rate limit exceeded pursuant to platform security guidelines.',
          retryAfterSeconds: rateResult.resetSeconds,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateResult),
        }
      );
    }
  }

  // 3. Protected Route Security & Clearance Verification
  const isOperatorRoute = pathname.startsWith('/operator') || pathname.startsWith('/admin');
  const isPortalRoute = pathname.startsWith('/portal');

  if (isOperatorRoute || isPortalRoute) {
    // Check for Supabase session token or operator clearance token
    const hasSupabaseToken =
      request.cookies.has('sb-access-token') ||
      request.cookies.has('sb-auth-token') ||
      request.cookies.has('supabase-auth-token') ||
      request.cookies.has('ar_operator_clearance_v2');

    // Also permit local development bypass for quick operator verification
    const isLocalDev = process.env.NODE_ENV === 'development';

    if (!hasSupabaseToken && !isLocalDev) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Attach standard security response headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (svg, png, pdf)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)',
  ],
};
