"use client";

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Calendar,
  ClipboardList,
  Users,
  ChevronRight,
  Award,
  Activity,
  BarChart,
  Sparkles,
  Bot,
  Rocket
} from 'lucide-react';
import Link from 'next/link';
import { WizardPhil } from '../features/ai/WizardPhil';

export function Dashboard() {
  const [isWizardPhilOpen, setIsWizardPhilOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Feature Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all hover:scale-105"
          onClick={() => setIsWizardPhilOpen(true)}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Featuring Now - WizardPhil
          <Bot className="ml-2 h-5 w-5" />
        </Button>

        <Link href="/demo">
          <Button
            size="lg"
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg transition-all hover:scale-105"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Try Demo
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">0</div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shows</CardTitle>
            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">0</div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">
              Shows scheduled
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            <ClipboardList className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">0</div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
              Completed evaluations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">-</div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Shows
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/shows">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mb-4 opacity-20" />
              <p>No upcoming shows scheduled</p>
              <p className="text-sm">Add your first show to get started</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Recent Animals
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/animals">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mb-4 opacity-20" />
              <p>No animals registered yet</p>
              <p className="text-sm">Add your first animal to get started</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-500" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <BarChart className="h-12 w-12 mb-4 opacity-20" />
            <p>No performance data available</p>
            <p className="text-sm">Complete evaluations to see performance metrics</p>
          </div>
        </CardContent>
      </Card>

      {/* WizardPhil Component */}
      <WizardPhil isOpen={isWizardPhilOpen} onOpenChange={setIsWizardPhilOpen} />
    </div>
  );
}

function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex flex-row items-center justify-between space-y-0 pb-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '', ...props }) {
  return (
    <div className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
