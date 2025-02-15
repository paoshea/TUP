"use client";

import { Header } from '@/components/layout/Navigation/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
