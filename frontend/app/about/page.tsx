"use client";

import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">About TUP Assistant</h1>
          <p className="text-xl text-gray-600">
            Empowering livestock professionals with advanced evaluation and management tools
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            TUP Assistant is dedicated to revolutionizing livestock management through innovative technology. 
            We provide comprehensive tools for evaluation, tracking, and analysis, helping professionals 
            make data-driven decisions and achieve optimal results in their livestock operations.
          </p>
        </Card>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Advanced Evaluation</h3>
            <p className="text-gray-600">
              Our platform offers sophisticated evaluation tools, enabling detailed assessment 
              of livestock characteristics, performance metrics, and breeding potential.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Show Management</h3>
            <p className="text-gray-600">
              Streamline your show participation with comprehensive management tools, 
              from registration to results tracking and performance analysis.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Leverage artificial intelligence for automated analysis, performance predictions, 
              and data-driven recommendations to optimize your operations.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Mobile Accessibility</h3>
            <p className="text-gray-600">
              Access your data anywhere with our mobile-optimized platform, featuring 
              offline capabilities and seamless synchronization.
            </p>
          </Card>
        </div>

        {/* Team Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <p className="text-gray-600 mb-4">
            TUP Assistant is developed by a team of passionate professionals combining expertise 
            in livestock management, software development, and artificial intelligence.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3" />
              <h4 className="font-semibold">John Smith</h4>
              <p className="text-sm text-gray-500">Livestock Expert</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3" />
              <h4 className="font-semibold">Sarah Johnson</h4>
              <p className="text-sm text-gray-500">Software Architect</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3" />
              <h4 className="font-semibold">Michael Chen</h4>
              <p className="text-sm text-gray-500">AI Specialist</p>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Have questions about TUP Assistant? We&apos;re here to help. Contact our team 
            for more information about our platform and services.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-600">contact@tupassistant.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}