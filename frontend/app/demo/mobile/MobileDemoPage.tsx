'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function MobileDemoPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-lg font-semibold">Mobile Demo</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4 px-4 sm:px-6 space-y-6">
        {/* Camera Demo Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 touch:p-6">
          <h2 className="text-lg font-semibold mb-4">Camera Demo</h2>
          <div className="space-y-4">
            <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
              Camera placeholder
            </div>
          </div>
        </div>

        {/* Responsive Elements Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 touch:p-6">
          <h2 className="text-lg font-semibold mb-4">Responsive Elements</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                1
              </div>
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                2
              </div>
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                3
              </div>
            </div>
            <div className="touch:text-lg sm:text-base">
              This text is larger on touch devices
            </div>
            <div className="h-12 touch:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
              Taller on touch devices
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container h-[60px] flex items-center justify-around">
          <button className="p-2 text-sm">
            <span className="sr-only">Home</span>
            <div className="w-6 h-6 bg-primary/10 rounded"></div>
          </button>
          <button className="p-2 text-sm">
            <span className="sr-only">Camera</span>
            <div className="w-6 h-6 bg-primary/10 rounded"></div>
          </button>
          <button className="p-2 text-sm">
            <span className="sr-only">Profile</span>
            <div className="w-6 h-6 bg-primary/10 rounded"></div>
          </button>
        </div>
      </nav>
    </div>
  );
}