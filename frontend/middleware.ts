import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Add error handling headers
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  } catch (error) {
    // Redirect to error page for any errors
    return NextResponse.redirect(new URL('/_error', request.url));
  }
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