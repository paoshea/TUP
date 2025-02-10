import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('\n[API Middleware] ========== Request Start ==========');
  console.log('[API Middleware] Request details:', {
    url: request.url,
    method: request.method,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
    pathname: request.nextUrl.pathname,
  });

  // Continue with the request
  const response = NextResponse.next();

  // Add timing header
  response.headers.set('X-API-Time', new Date().toISOString());

  console.log('[API Middleware] Response headers:', Object.fromEntries(response.headers.entries()));
  console.log('[API Middleware] ========== Request End ==========\n');

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: '/api/:path*',
};