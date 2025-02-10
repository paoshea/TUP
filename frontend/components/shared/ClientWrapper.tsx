"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from './ErrorBoundary';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}