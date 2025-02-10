"use client";

import { WizardPhil } from '@/components/features/ai';
import { useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);
  const user = mockStore.getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to TUP Assistant
          </h1>
          {user ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome back, {user.name}! Continue managing your livestock with our
                AI-powered platform.
              </p>
              <Button
                onClick={() => setShowWizard(true)}
                className="flex items-center"
              >
                Ask WizardPhil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Transform your livestock management with AI-powered insights and
                expert guidance.
              </p>
              <Button
                onClick={() => window.location.href = '/auth/signin'}
                className="flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {showWizard && (
          <WizardPhil
            onClose={() => setShowWizard(false)}
            initialMessage={
              user
                ? `Hi ${user.name}! How can I help you today?`
                : "Hello! I'm WizardPhil, your AI assistant. How can I help you?"
            }
          />
        )}
      </div>
    </div>
  );
}
