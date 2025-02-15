"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
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
            <select
              value={selectedRegion.name}
              onChange={(e) => {
                const value = e.target.value;
                const region = regions.find(r => r.name === value);
                if (region) setSelectedRegion(region);
              }}
              className="w-[180px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {regions.map(region => (
                <option key={region.name} value={region.name}>{region.name}</option>
              ))}
            </select>
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
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${90 - index * 10}%` }}
                      />
                    </div>
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
