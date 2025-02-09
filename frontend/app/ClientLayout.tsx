"use client";

import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ErrorBoundary>
  );
}