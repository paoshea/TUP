"use client";

import React from 'react';
import { MapPin, TrendingUp, History, Users } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Regional Insights</h2>

      <div className="grid grid-cols-1 gap-6">
        {regions.map((region) => (
          <div
            key={region.name}
            className="border rounded-lg p-6 space-y-4 hover:border-blue-500 transition-colors"
          >
            {/* Region Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{region.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{region.showStats.participationRate}% Participation</span>
              </div>
            </div>

            {/* Areas */}
            <div className="pl-7">
              <p className="text-sm text-gray-600 mb-1">Areas:</p>
              <div className="flex flex-wrap gap-2">
                {region.areas.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Characteristics */}
            <div className="pl-7">
              <p className="text-sm text-gray-600 mb-2">Key Characteristics:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {region.characteristics.map((trait) => (
                  <li key={trait}>{trait}</li>
                ))}
              </ul>
            </div>

            {/* Historical Data */}
            <div className="flex items-start gap-2 pl-7">
              <History className="h-5 w-5 text-gray-500 mt-0.5" />
              <p className="text-gray-700">{region.historicalData}</p>
            </div>

            {/* Show Statistics */}
            <div className="mt-4 pl-7">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Show Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Average Score</p>
                    <p className="text-xl font-semibold text-blue-900">
                      {region.showStats.averageScore}/10
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Top Breeds</p>
                    <ul className="text-blue-900">
                      {region.showStats.topBreeds.map((breed) => (
                        <li key={breed} className="text-sm">
                          {breed}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Participation Rate</p>
                    <p className="text-xl font-semibold text-blue-900">
                      {region.showStats.participationRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Region Selection Map - Placeholder */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">Interactive region map coming soon</p>
      </div>
    </div>
  );
}