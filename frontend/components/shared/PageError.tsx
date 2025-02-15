"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PageErrorProps {
  error: Error;
  reset?: () => void;
  pageName: string;
}

export function PageError({ error, reset, pageName }: PageErrorProps) {
  React.useEffect(() => {
    console.error(`Error in ${pageName}:`, error);
  }, [error, pageName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading {pageName}</h1>
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/" className="inline-flex">
            <Button variant="outline">Go Home</Button>
          </Link>
          {reset && (
            <Button onClick={reset}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}