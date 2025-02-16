"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function PublicHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center rounded-lg bg-primary text-white font-bold p-2">
              TUP
            </div>
            <span className="font-semibold hidden sm:inline">LiveStock Show Assistant</span>
          </Link>

          {/* Public Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Documentation
            </Link>
            <Link href="/support" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Support
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}