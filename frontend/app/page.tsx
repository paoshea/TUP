"use client";

import { WizardPhil } from '@/components/features/ai';
import { useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link, { type LinkProps } from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);
  const user = mockStore.getCurrentUser();

  const features = [
    {
      icon: "📸",
      title: "Animal Management",
      description: "Track and manage your livestock with detailed records and photo documentation."
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Gain insights with comprehensive analytics and performance tracking."
    },
    {
      icon: "💬",
      title: "AI Assistant",
      description: "Get expert guidance from WizardPhil, your AI-powered livestock assistant."
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Access your data anywhere with our mobile-friendly interface."
    },
    {
      icon: "☁️",
      title: "Offline Support",
      description: "Work without interruption with full offline functionality."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold mb-4">
              Transform Your Livestock Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Harness the power of AI and data analytics to optimize your livestock operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/auth/signup'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
              >
                Get Started Free
                <span className="ml-2">→</span>
              </Button>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="shadow-lg"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4 text-primary">
                  {feature.icon}
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/auth/signup'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              Create Free Account
              <span className="ml-2">→</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowWizard(true)}
              className="shadow-lg"
            >
              Ask WizardPhil
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-600 hover:text-primary">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-600 hover:text-primary">Pricing</Link></li>
                <li><Link href="#demo" className="text-gray-600 hover:text-primary">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#docs" className="text-gray-600 hover:text-primary">Documentation</Link></li>
                <li><Link href="#guides" className="text-gray-600 hover:text-primary">Guides</Link></li>
                <li><Link href="#support" className="text-gray-600 hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#about" className="text-gray-600 hover:text-primary">About</Link></li>
                <li><Link href="#contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
                <li><Link href="#privacy" className="text-gray-600 hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#terms" className="text-gray-600 hover:text-primary">Terms</Link></li>
                <li><Link href="#privacy" className="text-gray-600 hover:text-primary">Privacy</Link></li>
                <li><Link href="#cookies" className="text-gray-600 hover:text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} TUP Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <WizardPhil 
        isOpen={showWizard}
        onOpenChange={setShowWizard}
        initialMessage={
            user
              ? `Hi ${user.name}! How can I help you today?`
              : "Hello! I'm WizardPhil, your AI assistant. How can I help you?"
          }
      />
    </div>
  );
}
