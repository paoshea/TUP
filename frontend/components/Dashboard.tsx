"use client";

import React from 'react';
import Link from 'next/link';
import { ClipboardList, Calendar, Map, Settings } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';

const features = [
  {
    name: 'Pre-Show Preparation',
    icon: ClipboardList,
    description: 'Create checklists and import animal details',
    href: '/preparation',
  },
  {
    name: 'Show Schedule',
    icon: Calendar,
    description: 'View and manage your show timeline',
    href: '/schedule',
  },
  {
    name: 'Regional Insights',
    icon: Map,
    description: 'Access region-specific evaluation criteria',
    href: '/insights',
  },
  {
    name: 'Settings',
    icon: Settings,
    description: 'Customize your evaluation preferences',
    href: '/settings',
  },
];

export function Dashboard() {
  return (
    <div className="container space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to LiveStock Show Assistant</h1>
        <p className="text-muted-foreground">
          Manage your livestock shows and evaluations from one central dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card key={feature.name} className="relative group overflow-hidden">
            <Link href={feature.href} className="absolute inset-0 z-10">
              <span className="sr-only">{feature.name}</span>
            </Link>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold tracking-tight">{feature.name}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Evaluations</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/evaluations">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No recent evaluations found.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button asChild>
            <Link href="/evaluations/new">
              <ClipboardList className="mr-2 h-4 w-4" />
              New Evaluation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/animals">
              <Map className="mr-2 h-4 w-4" />
              View Animals
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shows">
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Shows
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}