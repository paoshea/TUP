"use client";

import React, { useState } from 'react';
import { Award, AlertCircle, LineChart, Dna, Crown, Check, TrendingUp, History, Users } from 'lucide-react';

const historicalFlocks = [
  {
    id: 1,
    name: "Queen Mother's Caithness Flock",
    established: 1952,
    achievements: [
      "Supreme Champion Highland Show 1965, 1967",
      "Best Group of Three 1964-1968"
    ],
    notableTraits: "Exceptional breed character, strong maternal lines",
    showPerformance: 95,
    regions: ["Caithness", "Sutherland"],
    keyMetrics: {
      breedingSuccess: 92,
      woolQuality: 88,
      conformationScore: 94
    }
  }
];

export function FlockAnalyzer() {
  const [selectedFlock, setSelectedFlock] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('historical');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleFlockSelect = (id: number) => {
    setSelectedFlock(id);
    setShowAnalysis(true);
  };

  const renderHistoricalData = () => {
    const flock = historicalFlocks.find(f => f.id === selectedFlock);
    if (!flock) return null;

    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Crown className="text-yellow-500" />
            {flock.name}
          </h3>
          <span className="text-gray-500">Est. {flock.established}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="text-blue-500" />
              Achievements
            </h4>
            <ul className="space-y-2">
              {flock.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="text-green-500" size={16} />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Dna className="text-purple-500" />
              Notable Traits
            </h4>
            <p className="text-gray-700">{flock.notableTraits}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-blue-500" />
              <span className="font-semibold">Show Performance</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{flock.showPerformance}%</div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-green-500" />
              <span className="font-semibold">Breeding Success</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{flock.keyMetrics.breedingSuccess}%</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="text-purple-500" />
              <span className="font-semibold">Conformation</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{flock.keyMetrics.conformationScore}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flock Analysis</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'historical'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="inline-block mr-2" size={18} />
            Historical Data
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'analysis'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LineChart className="inline-block mr-2" size={18} />
            Analysis
          </button>
        </div>
      </div>

      {activeTab === 'historical' && (
        <div className="grid grid-cols-1 gap-4">
          {historicalFlocks.map(flock => (
            <button
              key={flock.id}
              onClick={() => handleFlockSelect(flock.id)}
              className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{flock.name}</h3>
                <span className="text-gray-500">Est. {flock.established}</span>
              </div>
              <div className="mt-2 text-gray-600">
                Regions: {flock.regions.join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {showAnalysis && renderHistoricalData()}

      {activeTab === 'analysis' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-yellow-500" />
            <p className="text-gray-600">Select a flock from the historical data to view detailed analysis.</p>
          </div>
        </div>
      )}
    </div>
  );
}