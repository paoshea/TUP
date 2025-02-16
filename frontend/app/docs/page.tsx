"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  description: string;
  path: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  articles: Article[];
};

const documentation: readonly Section[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of TUP Assistant and get up and running quickly.",
    articles: [
      {
        id: "introduction",
        title: "Introduction to TUP Assistant",
        description: "Overview of the platform and its core features.",
        path: "/docs/getting-started/introduction"
      },
      {
        id: "quick-start",
        title: "Quick Start Guide",
        description: "Set up your account and start using TUP Assistant in minutes.",
        path: "/docs/getting-started/quick-start"
      },
      {
        id: "system-requirements",
        title: "System Requirements",
        description: "Technical requirements and supported platforms.",
        path: "/docs/getting-started/requirements"
      }
    ]
  },
  {
    id: "features",
    title: "Features & Functionality",
    description: "Detailed guides for using TUP Assistant's features.",
    articles: [
      {
        id: "animal-management",
        title: "Animal Management",
        description: "Learn how to manage your livestock records effectively.",
        path: "/docs/features/animal-management"
      },
      {
        id: "evaluations",
        title: "Evaluations System",
        description: "Create and manage comprehensive evaluations.",
        path: "/docs/features/evaluations"
      },
      {
        id: "shows",
        title: "Show Management",
        description: "Track show entries, results, and performance.",
        path: "/docs/features/shows"
      },
      {
        id: "analytics",
        title: "Analytics & Insights",
        description: "Understand your data with powerful analytics tools.",
        path: "/docs/features/analytics"
      }
    ]
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    description: "In-depth guides for power users and advanced features.",
    articles: [
      {
        id: "ai-features",
        title: "AI-Powered Features",
        description: "Leverage artificial intelligence in your workflow.",
        path: "/docs/advanced/ai-features"
      },
      {
        id: "data-import",
        title: "Data Import & Export",
        description: "Manage your data with import and export tools.",
        path: "/docs/advanced/data-management"
      },
      {
        id: "api",
        title: "API Documentation",
        description: "Integrate TUP Assistant with your systems.",
        path: "/docs/advanced/api"
      }
    ]
  },
  {
    id: "support",
    title: "Support & Troubleshooting",
    description: "Find help and resolve common issues.",
    articles: [
      {
        id: "faq",
        title: "Frequently Asked Questions",
        description: "Answers to common questions and issues.",
        path: "/docs/support/faq"
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting Guide",
        description: "Resolve common problems and errors.",
        path: "/docs/support/troubleshooting"
      },
      {
        id: "contact",
        title: "Contact Support",
        description: "Get help from our support team.",
        path: "/docs/support/contact"
      }
    ]
  }
] as const;

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documentation.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to know about using TUP Assistant
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <input
              type="search"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredDocs.map(section => (
            <Card key={section.id} className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-600 mb-6">{section.description}</p>

              <div className="space-y-4">
                {section.articles.map(article => (
                  <div
                    key={article.id}
                    className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Link href={{ pathname: article.path }}>
                      <h3 className="font-semibold mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-600">{article.description}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <Link href={{ pathname: "/docs/getting-started/quick-start" }}>
                <h3 className="font-semibold mb-1">Quick Start Guide</h3>
                <p className="text-sm text-gray-600">Get started in minutes</p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <Link href={{ pathname: "/docs/support/faq" }}>
                <h3 className="font-semibold mb-1">FAQs</h3>
                <p className="text-sm text-gray-600">Common questions answered</p>
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <Link href={{ pathname: "/docs/advanced/api" }}>
                <h3 className="font-semibold mb-1">API Documentation</h3>
                <p className="text-sm text-gray-600">Integration guides</p>
              </Link>
            </div>
          </div>
        </Card>

        {/* Help Section */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Need More Help?</h2>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div>
            <Link href={{ pathname: "/support" }}>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}