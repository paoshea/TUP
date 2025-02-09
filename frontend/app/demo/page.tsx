"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardPhil } from '@/components/WizardPhil';
import { 
  Bot, 
  ClipboardList, 
  LineChart, 
  Camera, 
  Award, 
  Globe, 
  Cloud, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the TUP Livestock Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our comprehensive livestock management system with advanced AI features,
            performance tracking, and show management tools.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* WizardPhil AI Assistant */}
          <Card className="relative overflow-hidden border-2 border-purple-500">
            <div className="absolute top-0 right-0 p-2">
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-500" />
                WizardPhil AI Assistant
              </CardTitle>
              <CardDescription>
                Your intelligent companion for livestock evaluation and advice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Expert breed analysis and recommendations</li>
                <li>• Show preparation guidance</li>
                <li>• Performance evaluation insights</li>
                <li>• Voice and text interaction</li>
              </ul>
            </CardContent>
          </Card>

          {/* Performance Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                Performance Tracking
              </CardTitle>
              <CardDescription>
                Comprehensive analytics and progress monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Detailed performance metrics</li>
                <li>• Historical trend analysis</li>
                <li>• Custom scoring systems</li>
                <li>• Progress visualization</li>
              </ul>
            </CardContent>
          </Card>

          {/* Show Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                Show Management
              </CardTitle>
              <CardDescription>
                Streamlined show planning and participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Event scheduling and tracking</li>
                <li>• Entry management</li>
                <li>• Results recording</li>
                <li>• Performance history</li>
              </ul>
            </CardContent>
          </Card>

          {/* Photo Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-amber-500" />
                Photo Analysis
              </CardTitle>
              <CardDescription>
                AI-powered visual assessment tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Conformation analysis</li>
                <li>• Breed standard comparison</li>
                <li>• Growth tracking</li>
                <li>• Visual progress monitoring</li>
              </ul>
            </CardContent>
          </Card>

          {/* Evaluation Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-red-500" />
                Evaluation Tools
              </CardTitle>
              <CardDescription>
                Professional assessment and scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Standardized evaluation forms</li>
                <li>• Custom scoring criteria</li>
                <li>• Comparative analysis</li>
                <li>• Detailed reporting</li>
              </ul>
            </CardContent>
          </Card>

          {/* Offline Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-indigo-500" />
                Offline Capabilities
              </CardTitle>
              <CardDescription>
                Work anywhere, anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Offline data access</li>
                <li>• Automatic synchronization</li>
                <li>• Local data storage</li>
                <li>• Conflict resolution</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Try Now Section */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-muted-foreground mb-6">
            Try out WizardPhil, our AI-powered livestock assistant, and experience
            the future of livestock management.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all hover:scale-105"
          >
            <Bot className="mr-2 h-5 w-5" />
            Start Demo
          </Button>
        </div>

        {/* WizardPhil Component */}
        <WizardPhil />
      </div>
    </div>
  );
}