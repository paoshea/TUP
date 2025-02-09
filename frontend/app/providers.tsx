"use client";

import { ThemeProvider } from 'next-themes';
import Script from 'next/script';

function ServiceWorkerScript() {
  return (
    <Script
      id="register-sw"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerScript />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
}