'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Create a component that loads and renders the mobile demo content
function ExternalMobileContent() {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    import('./MobileDemoContent')
      .then((module) => {
        setComponent(() => module.default);
      })
      .catch((error) => {
        console.error('Error loading MobileDemoContent:', error);
      });
  }, []);

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading mobile demo...</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

// Use Next.js dynamic import with the properly typed component
const MobileWrapper = dynamic(() => Promise.resolve(ExternalMobileContent), {
  ssr: false
});

export default function MobileClient() {
  return <MobileWrapper />;
}