import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TUP Livestock Management System',
  description: 'A comprehensive livestock management system for show animals',
  keywords: [
    'livestock',
    'management',
    'show animals',
    'evaluation',
    'breeding',
    'agriculture'
  ],
  manifest: '/manifest.json'
};

export const viewport: Viewport = {
  themeColor: '#007bff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
