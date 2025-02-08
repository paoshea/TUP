"use client";

import React from 'react';
import { MapPin, TrendingUp, History, Users } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';

const regions = [
  {
    name: 'Borders Region',
    areas: ['Roxburghshire', 'Berwickshire', 'Peeblesshire'],
    characteristics: ['Strong bone structure', 'Well-developed gigots', 'Traditional breed traits'],
    historicalData: 'Known for traditional Scottish Blackface breeding since the 1800s',
    showStats: {
      participationRate: 85,
      averageScore: 8.2,
      topBreeds: ['Scottish Blackface', 'Cheviot', 'Suffolk']
    }
  },
  {
    name: 'Highland Region',
    areas: ['Inverness-shire', 'Ross and Cromarty', 'Sutherland'],
    characteristics: ['Hardy constitution', 'Excellent foraging ability', 'Compact frame'],
    historicalData: 'Historic region for Highland cattle and traditional sheep breeds',
    showStats: {
      participationRate: 78,
      averageScore: 7.9,
      topBreeds: ['Highland', 'North Country Cheviot', 'Hebridean']
    }
  }
];

export function RegionalInsights() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Regional Insights</h2>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6">
        {regions.map((region) => (
          <Card key={region.name}>
            <CardContent className="pt-6">
              {/* Region Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{region.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Progress value={region.showStats.participationRate} className="w-[100px]" />
                  <span className="text-sm text-muted-foreground">
                    {region.showStats.participationRate}%
                  </span>
                </div>
              </div>

              {/* Areas */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium">Areas:</p>
                <div className="flex flex-wrap gap-2">
                  {region.areas.map((area) => (
                    <Badge key={area} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Characteristics */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium">Key Characteristics:</p>
                <ul className="grid gap-1.5">
                  {region.characteristics.map((trait) => (
                    <li key={trait} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Historical Data */}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-start gap-2 cursor-help">
                    <History className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{region.historicalData}</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Historical Context</h4>
                    <p className="text-sm text-muted-foreground">{region.historicalData}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Show Statistics */}
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Show Statistics
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-semibold">
                      {region.showStats.averageScore}
                      <span className="text-sm text-muted-foreground">/10</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Top Breeds</p>
                    <ul className="space-y-1">
                      {region.showStats.topBreeds.map((breed) => (
                        <li key={breed} className="text-sm">
                          {breed}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Participation Rate</p>
                    <p className="text-2xl font-semibold">
                      {region.showStats.participationRate}
                      <span className="text-sm text-muted-foreground">%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        ))}
      </CardContent>

      <CardFooter>
        <Card className="w-full">
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            Interactive region map coming soon
          </CardContent>
        </Card>
      </CardFooter>
    </Card>
  );
}