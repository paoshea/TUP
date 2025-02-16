"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Basic',
    price: '$29',
    period: 'per month',
    description: 'Perfect for individual livestock professionals',
    features: [
      'Up to 50 animal records',
      'Basic evaluation tools',
      'Show management',
      'Mobile access',
      'Email support'
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=basic'
  },
  {
    name: 'Professional',
    price: '$79',
    period: 'per month',
    description: 'Ideal for growing operations',
    features: [
      'Up to 200 animal records',
      'Advanced evaluation tools',
      'AI-powered insights',
      'Show management',
      'Offline access',
      'Priority support',
      'Data analytics',
      'Custom reports'
    ],
    cta: 'Get Started',
    href: '/auth/signup?plan=pro',
    featured: true
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: 'per month',
    description: 'For large-scale operations',
    features: [
      'Unlimited animal records',
      'Advanced evaluation tools',
      'AI-powered insights',
      'Show management',
      'Offline access',
      'Premium support',
      'Advanced analytics',
      'Custom reports',
      'API access',
      'Custom integrations',
      'Team management',
      'Training sessions'
    ],
    cta: 'Contact Sales',
    href: '/contact?plan=enterprise'
  }
];

const CheckIcon = () => (
  <svg
    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`p-6 relative ${
                tier.featured
                  ? 'border-2 border-primary shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold mb-2">{tier.price}</div>
                <div className="text-gray-500">{tier.period}</div>
              </div>

              <p className="text-gray-600 text-center mb-6">
                {tier.description}
              </p>

              <Link href={{ pathname: tier.href }}>
                <Button
                  className={`w-full mb-6 ${
                    tier.featured ? 'bg-primary' : 'bg-gray-800'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="p-6 mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes, all plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan? Contact our sales team.
          </p>
          <Link href={{ pathname: '/contact' }}>
            <Button variant="outline">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}