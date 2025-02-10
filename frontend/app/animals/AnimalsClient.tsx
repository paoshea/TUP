'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Create a component that loads and renders the external script
function ExternalAnimalsWrapper() {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/animals/AnimalsWrapper.js';
    script.onload = () => {
      if (typeof window !== 'undefined' && window.AnimalsWrapper) {
        setComponent(() => window.AnimalsWrapper);
      }
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading animals...</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

// Use Next.js dynamic import with the properly typed component
const AnimalsWrapper = dynamic(() => Promise.resolve(ExternalAnimalsWrapper), {
  ssr: false
});

export default function AnimalsClient() {
  return <AnimalsWrapper />;
}