"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Route } from 'next';

interface SupportCategory {
  title: string;
  description: string;
  icon: JSX.Element;
  href: Route | string;
  isExternal?: boolean;
}

const supportCategories: SupportCategory[] = [
  {
    title: 'Documentation',
    description: 'Browse our comprehensive documentation and guides',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    href: '/docs' as Route
  },
  {
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    href: '#chat',
    isExternal: true
  },
  {
    title: 'Email Support',
    description: 'Send us an email and we\'ll get back to you',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    href: 'mailto:support@tupassistant.com',
    isExternal: true
  },
  {
    title: 'Phone Support',
    description: 'Available for Enterprise customers',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    href: 'tel:+15551234567',
    isExternal: true
  }
];

const faqItems = [
  {
    question: 'How do I get started with TUP Assistant?',
    answer: 'Sign up for a free trial, and our onboarding team will guide you through the setup process. You can also explore our documentation for detailed instructions.'
  },
  {
    question: 'What are the system requirements?',
    answer: 'TUP Assistant is a web-based platform that works on any modern browser. For optimal performance, we recommend using the latest version of Chrome, Firefox, or Safari.'
  },
  {
    question: 'How does offline mode work?',
    answer: 'Our platform automatically syncs data when you\'re online and stores it locally for offline access. Changes made offline will sync automatically when you reconnect.'
  },
  {
    question: 'Can I import existing data?',
    answer: 'Yes, we support data import from various formats including CSV and Excel. Contact our support team for assistance with data migration.'
  }
];

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-600">
            Find the support you need through our various channels
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {supportCategories.map((category) => (
            <Card key={category.title} className="p-6">
              {category.isExternal ? (
                <a
                  href={category.href}
                  className="flex items-start space-x-4 hover:opacity-80 transition-opacity"
                  target={category.href.startsWith('http') ? '_blank' : undefined}
                  rel={category.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <div className="text-primary">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </a>
              ) : (
                <Link 
                  href={category.href as Route}
                  className="flex items-start space-x-4 hover:opacity-80 transition-opacity"
                >
                  <div className="text-primary">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </Link>
              )}
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 border rounded-md h-32"
                placeholder="Describe your issue..."
              />
            </div>
            <Button className="w-full">Send Message</Button>
          </div>
        </Card>

        {/* Additional Resources */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
          <div className="flex justify-center space-x-4">
            <Link href={'/docs' as Route}>
              <Button variant="outline">Documentation</Button>
            </Link>
            <Link href={'/about' as Route}>
              <Button variant="outline">About Us</Button>
            </Link>
            <Link href={'/pricing' as Route}>
              <Button variant="outline">Pricing</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}