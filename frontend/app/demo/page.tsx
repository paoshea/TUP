"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WizardPhil } from '@/components/WizardPhil';
import { Progress } from '@/components/ui/progress';
import { mockStore } from '@/lib/mock/store';
import { 
  Bot, 
  ClipboardList, 
  LineChart, 
  Camera, 
  Award, 
  Calendar,
  Cloud,
  ArrowLeft,
  Sparkles,
  Users,
  Activity,
  ChevronRight,
  BarChart
} from 'lucide-react';
import type { Show, Animal, Statistics } from '@/lib/types/mock';

export default function DemoPage() {
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isWizardPhilOpen, setIsWizardPhilOpen] = useState(false);

  useEffect(() => {
    const shows = mockStore.getUpcomingShows();
    const animals = mockStore.getAnimals().slice(0, 5);
    const statistics = mockStore.getStatistics();

    setUpcomingShows(shows);
    setRecentAnimals(animals);
    setStats(statistics);
  }, []);

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
            TUP Livestock Demo System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our comprehensive livestock management system with advanced AI features,
            performance tracking, and show management tools.
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.totalAnimals}</div>
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
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.upcomingShows}</div>
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
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.completedEvaluations}</div>
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
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">8.2</div>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  Overall performance
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* WizardPhil AI Assistant */}
          <Card 
            className="relative overflow-hidden border-2 border-purple-500 cursor-pointer hover:border-purple-600 transition-colors"
            onClick={() => setIsWizardPhilOpen(true)}
          >
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

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Upcoming Shows */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Shows
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/demo/shows">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingShows.map(show => (
                  <div key={show.id} className="flex items-center justify-between p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{show.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(show.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-blue-100 dark:hover:bg-blue-900" asChild>
                      <Link href={`/demo/shows/${show.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Animals */}
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Recent Animals
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/demo/animals">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnimals.map(animal => (
                  <div key={animal.id} className="flex items-center justify-between p-4 rounded-lg bg-green-50/50 dark:bg-green-950/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{animal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {animal.breed} • {animal.age} years
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900" asChild>
                      <Link href={`/demo/animals/${animal.id}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        {recentAnimals.length > 0 && (
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-500" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnimals.slice(0, 1).map(animal => (
                  <div key={animal.id} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Movement</span>
                        <span className="text-muted-foreground">{animal.scores.movement}/10</span>
                      </div>
                      <Progress value={animal.scores.movement * 10} className="bg-purple-100 dark:bg-purple-950">
                        <div className="h-full bg-purple-500" style={{ width: `${animal.scores.movement * 10}%` }} />
                      </Progress>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conformation</span>
                        <span className="text-muted-foreground">{animal.scores.conformation}/10</span>
                      </div>
                      <Progress value={animal.scores.conformation * 10} className="bg-purple-100 dark:bg-purple-950">
                        <div className="h-full bg-purple-500" style={{ width: `${animal.scores.conformation * 10}%` }} />
                      </Progress>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Muscle Development</span>
                        <span className="text-muted-foreground">{animal.scores.muscleDevelopment}/10</span>
                      </div>
                      <Progress value={animal.scores.muscleDevelopment * 10} className="bg-purple-100 dark:bg-purple-950">
                        <div className="h-full bg-purple-500" style={{ width: `${animal.scores.muscleDevelopment * 10}%` }} />
                      </Progress>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Breed Characteristics</span>
                        <span className="text-muted-foreground">{animal.scores.breedCharacteristics}/10</span>
                      </div>
                      <Progress value={animal.scores.breedCharacteristics * 10} className="bg-purple-100 dark:bg-purple-950">
                        <div className="h-full bg-purple-500" style={{ width: `${animal.scores.breedCharacteristics * 10}%` }} />
                      </Progress>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* WizardPhil Component */}
        <WizardPhil isOpen={isWizardPhilOpen} onOpenChange={setIsWizardPhilOpen} />
      </div>
    </div>
  );
}