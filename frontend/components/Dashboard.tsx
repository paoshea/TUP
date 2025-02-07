"use client";

import React from 'react';
import { ClipboardList, Calendar, Map, Settings } from 'lucide-react';

const features = [
  {
    name: 'Pre-Show Preparation',
    icon: ClipboardList,
    description: 'Create checklists and import animal details',
  },
  {
    name: 'Show Schedule',
    icon: Calendar,
    description: 'View and manage your show timeline',
  },
  {
    name: 'Regional Insights',
    icon: Map,
    description: 'Access region-specific evaluation criteria',
  },
  {
    name: 'Settings',
    icon: Settings,
    description: 'Customize your evaluation preferences',
  },
];

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to LiveStock Show Assistant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Evaluations</h3>
        <div className="text-gray-600">No recent evaluations found.</div>
      </div>
    </div>
  );
}