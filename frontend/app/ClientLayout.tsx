"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Navigation/Header';
import { PublicHeader } from '@/components/layout/Navigation/PublicHeader';
import { Footer } from '@/components/layout/Footer';

// Routes that should use the authenticated header
const AUTHENTICATED_ROUTES = [
  '/demo',
  '/animals',
  '/shows',
  '/evaluations',
  '/analytics',
  '/settings',
  '/profile'
];

// Routes that should use the public header
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/docs',
  '/support',
  '/terms',
  '/privacy',
  '/cookies',
  '/auth/signin',
  '/auth/signup'
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path is an authenticated route
  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Check if current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith('/auth/')
  );

  return (
    <>
      {isAuthenticatedRoute ? <Header /> : <PublicHeader />}
      <main className="container mx-auto px-4 pt-20 pb-16">
        {children}
      </main>
      <Footer />
    </>
  );
}