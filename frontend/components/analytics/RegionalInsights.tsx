"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Progress } from './ui/progress';
import {
  Map,
  BarChart3,
  TrendingUp,
  Globe,
} from 'lucide-react';
import type { Region } from '@/lib/types/mock';

export function RegionalInsights() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    const allRegions = mockStore.getRegions();
    setRegions(allRegions);
    if (allRegions.length > 0) {
      setSelectedRegion(allRegions[0]);
    }
  }, []);

  if (!selectedRegion) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">Loading regional data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Regional Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analyze breed performance and trends by region
              </p>
            </div>
            <Select
              value={selectedRegion.name}
              onValueChange={(value) => {
                const region = regions.find(r => r.name === value);
                if (region) setSelectedRegion(region);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.name} value={region.name}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Participation Rate
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedRegion.showStats.participationRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Show participation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedRegion.showStats.averageScore.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Areas
                </CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedRegion.areas.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active showing areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Breeds
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedRegion.showStats.topBreeds.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Popular breeds
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Regional Characteristics</h3>
              <div className="space-y-2">
                {selectedRegion.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm">{characteristic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Top Performing Breeds</h3>
              <div className="space-y-4">
                {selectedRegion.showStats.topBreeds.map((breed, index) => (
                  <div key={breed} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{breed}</span>
                      <span className="text-muted-foreground">
                        {90 - index * 10}% success rate
                      </span>
                    </div>
                    <Progress value={90 - index * 10} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Historical Overview</h3>
              <p className="text-sm text-muted-foreground">
                {selectedRegion.historicalData}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}