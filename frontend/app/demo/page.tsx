"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WizardPhil } from '@/components/features/ai';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { AnimalDemo, EvaluationDemo, ShowDemo, AnalyticsDemo } from './components';
import { DemoContent } from './components/DemoContent';
import type { DemoStep } from './types';

const demoSteps: DemoStep[] = [
  {
    id: 'animals',
    title: 'Animal Management',
    description: 'Add and manage your livestock inventory with detailed records.',
    component: <AnimalDemo isLoading={false} />,
    action: async () => await mockStore.loadDemoData()
  },
  {
    id: 'evaluations',
    title: 'Evaluation System',
    description: 'Create comprehensive evaluations with our scoring system.',
    component: <EvaluationDemo isLoading={false} />,
    action: async () => await mockStore.loadDemoData()
  },
  {
    id: 'shows',
    title: 'Show Management',
    description: 'Track show entries, results, and performance metrics.',
    component: <ShowDemo isLoading={false} />,
    action: async () => await mockStore.loadDemoData()
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    description: 'Gain valuable insights with AI-powered analytics.',
    component: <AnalyticsDemo isLoading={false} />,
    action: async () => await mockStore.loadDemoData()
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(demoSteps[0].id);

  const handleDemoAction = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const step = demoSteps[currentStep];
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Load demo data for current step
      if (step.action) {
        await step.action();
      }

      // Mark step as completed
      setCompletedSteps(prev => [...prev, step.id]);

      // Move to next step if available
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setActiveTab(demoSteps[currentStep + 1].id);
      }
    } catch (error) {
      console.error('Demo action failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Card */}
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to TUP Assistant Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Experience the power of AI-assisted livestock management. This guided tour will
            walk you through the key features of our platform.
          </p>

          {/* Progress Overview */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
            <div className="grid grid-cols-4 gap-2">
              {demoSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 rounded ${
                    completedSteps.includes(step.id)
                      ? 'bg-primary'
                      : index === currentStep
                      ? 'bg-primary/50'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
            </div>
            <p className="text-gray-600">{currentStepData.description}</p>

            <Button
              onClick={handleDemoAction}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Loading...' : `Explore ${currentStepData.title}`}
            </Button>

            {isProcessing && (
              <Progress value={progress} className="w-full" />
            )}
          </div>
        </Card>

        {/* Feature Demo Area */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Step Navigation */}
            <div className="grid grid-cols-4 gap-2">
              {demoSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  disabled={!completedSteps.includes(step.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      activeTab === step.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                    ${
                      !completedSteps.includes(step.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }
                  `}
                >
                  {step.title}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="mt-4">
              {demoSteps.map((step) => (
                <DemoContent
                  key={step.id}
                  isActive={activeTab === step.id}
                >
                  {step.component}
                </DemoContent>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Assistant */}
        <WizardPhil
          initialMessage={`Hi! I'm WizardPhil, your AI assistant. Let me guide you through ${currentStepData.title}. Feel free to ask any questions!`}
        />
      </div>
    </div>
  );
}