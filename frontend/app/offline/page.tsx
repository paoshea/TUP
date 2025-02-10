"use client";

import { RefreshButton } from '@/components/shared';
import { MobileLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto p-6">
          <div className="text-center">
            <WifiOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              You're Offline
            </h1>
            <p className="text-gray-600 mb-6">
              Please check your internet connection and try again.
            </p>

            <div className="space-y-4">
              <RefreshButton
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </RefreshButton>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Return to Homepage
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}