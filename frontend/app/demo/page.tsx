"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WizardPhil } from '@/components/features/ai';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';

export default function DemoPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDemoAction = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Load demo data
      await mockStore.loadDemoData();
    } catch (error) {
      console.error('Demo action failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to TUP Assistant Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Experience the power of AI-assisted livestock management. This demo will
            walk you through the key features of our platform.
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleDemoAction}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Loading Demo...' : 'Start Demo'}
            </Button>

            {isProcessing && (
              <Progress value={progress} className="w-full" />
            )}
          </div>
        </Card>

        <WizardPhil
          initialMessage="Hi! I'm WizardPhil, your AI assistant. I'm here to help you explore the TUP platform and answer any questions you might have about livestock management."
        />
      </div>
    </div>
  );
}