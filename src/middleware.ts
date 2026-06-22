import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Block list of malicious referrers, hosts, or keywords
const BLOCKED_REFERRERS = ['hackerai.co', 'hackerai.com', 'hackerai'];
const BLOCKED_USER_AGENTS = [
  'hackerai',
  'sqlmap',
  'nikto',
  'dirbuster',
  'nmap',
  'w3af',
  'acunetix',
  'nessus',
  'gobuster',
  'censys',
  'zoomeye',
  'shodan',
  'bruteforce',
  'hydra',
];

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const referrer = request.headers.get('referer')?.toLowerCase() || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  // 1. Block by Referrer
  if (BLOCKED_REFERRERS.some(ref => referrer.includes(ref))) {
    console.warn(`[SECURITY] Blocked request from referrer ${referrer} (IP: ${ip})`);
    return new NextResponse('Access Denied: Request blocked by security policy.', { status: 403 });
  }

  // 2. Block by User Agent
  if (BLOCKED_USER_AGENTS.some(ua => userAgent.includes(ua))) {
    console.warn(`[SECURITY] Blocked request with user-agent ${userAgent} (IP: ${ip})`);
    return new NextResponse('Access Denied: Malicious scanner detected.', { status: 403 });
  }

  // 3. Block malicious path patterns (e.g. wp-admin, .env, etc.)
  const pathname = request.nextUrl.pathname.toLowerCase();
  const suspiciousPaths = [
    '/wp-admin',
    '/wp-login',
    '/.env',
    '/.git',
    '/config.json',
    '/xmlrpc.php',
    '/admin/config',
    '/actuator/health'
  ];
  if (suspiciousPaths.some(p => pathname.startsWith(p) || pathname.endsWith(p))) {
    console.warn(`[SECURITY] Blocked suspicious path request ${pathname} (IP: ${ip})`);
    return new NextResponse('Access Denied: Path not allowed.', { status: 403 });
  }

  // 4. Admin Route Guard
  const rawPathname = request.nextUrl.pathname;
  if (rawPathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;
    if (token) {
      try {
        const JWT_SECRET = new TextEncoder().encode(
          process.env.SUPABASE_SECRET_KEY || "stackforge-fallback-secret-2026-safe-key-value"
        );
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!payload || payload.role !== 'admin') {
          throw new Error('Invalid role');
        }
      } catch (err) {
        // Invalid or expired token: clear cookie and redirect to /admin to trigger login form
        console.warn(`[SECURITY] Invalid admin session token on /admin path. Clearing cookie.`);
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    }
  }

  if (rawPathname === '/api/admin') {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const isLogin = request.method === 'POST' && action !== 'logout';

    if (!isLogin) {
      const token = request.cookies.get('admin_session')?.value;
      if (!token) {
        console.warn(`[SECURITY] Unauthorized API request to /api/admin (missing token)`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      try {
        const JWT_SECRET = new TextEncoder().encode(
          process.env.SUPABASE_SECRET_KEY || "stackforge-fallback-secret-2026-safe-key-value"
        );
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!payload || payload.role !== 'admin') {
          throw new Error('Invalid role');
        }
      } catch (err) {
        console.warn(`[SECURITY] Unauthorized API request to /api/admin (invalid/expired token)`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  // 5. Add security headers to the response
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://images.pexels.com https://dl.oqens.me; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://auth.oqens.me https://dl.oqens.me; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
  );
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (.png, .jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
