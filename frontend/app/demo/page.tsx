"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockStore } from '@/lib/mock/store';
import { AnimalDemo, EvaluationDemo, ShowDemo, AnalyticsDemo } from './components';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: JSX.Element;
  action?: () => Promise<void>;
}

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
  const router = useRouter();
  const currentUser = mockStore.getCurrentUser();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser) {
    return null;
  }

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

          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </Card>

        {/* Feature Previews */}
        <div className="grid md:grid-cols-2 gap-6">
          {demoSteps.map((step) => (
            <Card key={step.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  Try {step.title}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Create your free account now and unlock all features of TUP Assistant.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}