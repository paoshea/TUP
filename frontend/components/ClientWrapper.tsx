
"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from './ErrorBoundary';
import { UIProvider } from '../context/UIContext';
import { AuthProvider } from '../context/AuthContext';
import { LivestockProvider } from '../context/LivestockContext';

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
        <AuthProvider>
          <UIProvider>
            <LivestockProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                {children}
              </div>
            </LivestockProvider>
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
