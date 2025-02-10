"use client";

import { Award, Users, Building2, Globe, Star, Cpu, ClipboardCheck, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About TUP Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Empowering livestock professionals with advanced technology and expertise in North Country Cheviot sheep evaluation and show management.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              TUP Assistant aims to revolutionize livestock evaluation and show management through innovative technology and AI-powered solutions. We're committed to helping professionals make data-driven decisions and achieve excellence in North Country Cheviot sheep breeding and showing.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Evaluation System</h3>
              <p className="text-gray-600">
                Comprehensive scoring system for movement, conformation, muscle development, and breed characteristics.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-600">
                WizardPhil AI provides expert guidance and analysis for livestock evaluation and management.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Show Management</h3>
              <p className="text-gray-600">
                Complete toolkit for organizing, managing, and participating in livestock shows.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                Committed to delivering the highest quality tools and services.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting and empowering the livestock community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Pioneering new technologies in livestock management.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p className="text-gray-600">
                Making a difference in livestock industries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6">
              <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
              <p className="text-gray-600 mb-4">
                "TUP Assistant has revolutionized how we evaluate and manage our North Country Cheviot flock. The AI assistance is invaluable."
              </p>
              <p className="font-semibold">John MacKenzie</p>
              <p className="text-sm text-gray-500">Highland Breeder</p>
            </Card>

            <Card className="p-6">
              <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
              <p className="text-gray-600 mb-4">
                "The evaluation system provides consistent, detailed scoring that has helped improve our breeding program significantly."
              </p>
              <p className="font-semibold">Sarah Campbell</p>
              <p className="text-sm text-gray-500">Show Judge</p>
            </Card>

            <Card className="p-6">
              <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
              <p className="text-gray-600 mb-4">
                "Managing shows has never been easier. The platform streamlines everything from entries to results."
              </p>
              <p className="font-semibold">Robert Douglas</p>
              <p className="text-sm text-gray-500">Show Organizer</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Phil OShea</h3>
              <p className="text-gray-600 mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-500">
                Visionary leader with extensive experience in software development and livestock industry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Alasdair MacLeod</h3>
              <p className="text-gray-600 mb-2">Livestock Expert</p>
              <p className="text-sm text-gray-500">
                Industry veteran with deep knowledge of North Country Cheviot sheep breeding and showing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">WizardPhil AI</h3>
              <p className="text-gray-600 mb-2">AI Assistant</p>
              <p className="text-sm text-gray-500">
                Advanced AI system specializing in livestock evaluation and analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Interested in learning more about TUP Assistant? Contact us today.
          </p>
          <p className="text-gray-600">
            Email: info@tupassistant.com<br />
            Phone: +44 (0) 123 456 7890
          </p>
        </div>
      </section>
    </div>
  );
}