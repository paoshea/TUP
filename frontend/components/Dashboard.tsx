"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Calendar,
  ClipboardList,
  TrendingUp,
  Users,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import type { Show, Animal, Statistics } from '@/lib/types/mock';

export function Dashboard() {
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    // Get data from mock store
    const shows = mockStore.getUpcomingShows();
    const animals = mockStore.getAnimals().slice(0, 5); // Get 5 most recent
    const statistics = mockStore.getStatistics();

    setUpcomingShows(shows);
    setRecentAnimals(animals);
    setStats(statistics);
  }, []);

  // Calculate average score from recent animals
  const averageScore = recentAnimals.length
    ? (
        recentAnimals.reduce(
          (sum, animal) =>
            sum +
            (animal.scores.movement +
              animal.scores.conformation +
              animal.scores.muscleDevelopment +
              animal.scores.breedCharacteristics) /
            4,
          0
        ) / recentAnimals.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnimals}</div>
                <p className="text-xs text-muted-foreground">
                  Registered in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Shows</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingShows}</div>
                <p className="text-xs text-muted-foreground">
                  Shows scheduled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedEvaluations}</div>
                <p className="text-xs text-muted-foreground">
                  Completed evaluations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore}</div>
                <p className="text-xs text-muted-foreground">
                  Overall performance
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShows.map(show => (
                <div key={show.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{show.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(show.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/shows/${show.id}`}>
                      <span className="sr-only">View show details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {upcomingShows.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming shows</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Animals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnimals.map(animal => (
                <div key={animal.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{animal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {animal.breed} • {animal.age} years old
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/animals/${animal.id}`}>
                      <span className="sr-only">View animal details</span>
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
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
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
                    <Progress value={animal.scores.movement * 10} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Conformation</span>
                      <span className="text-muted-foreground">{animal.scores.conformation}/10</span>
                    </div>
                    <Progress value={animal.scores.conformation * 10} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Muscle Development</span>
                      <span className="text-muted-foreground">{animal.scores.muscleDevelopment}/10</span>
                    </div>
                    <Progress value={animal.scores.muscleDevelopment * 10} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Breed Characteristics</span>
                      <span className="text-muted-foreground">{animal.scores.breedCharacteristics}/10</span>
                    </div>
                    <Progress value={animal.scores.breedCharacteristics * 10} />
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