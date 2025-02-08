"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Calendar,
  ClipboardList,
  Users,
  ChevronRight,
  Award,
  Activity,
  BarChart,
} from 'lucide-react';
import Link from 'next/link';
import type { Show, Animal, Statistics } from '@/lib/types/mock';

export function Dashboard() {
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    const shows = mockStore.getUpcomingShows();
    const animals = mockStore.getAnimals().slice(0, 5);
    const statistics = mockStore.getStatistics();

    setUpcomingShows(shows);
    setRecentAnimals(animals);
    setStats(statistics);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats && (
          <>
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
          </>
        )}
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
                    <Link href={`/shows/${show.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
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
                    <Link href={`/animals/${animal.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats && recentAnimals.length > 0 && (
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
    </div>
  );
}