import React from 'react';

export interface PerformanceData {
  date: string;
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  height?: number;
  showLegend?: boolean;
}

export function PerformanceChart({ data, height = 200, showLegend = false }: PerformanceChartProps) {
  // For demo purposes, we'll just show a simple text representation
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Performance Trends</h4>
      <div className="space-y-1">
        {data.map((point, index) => (
          <div key={point.date} className="text-sm">
            {new Date(point.date).toLocaleDateString()}: 
            <ul className="ml-4 list-disc">
              <li>Movement: {point.movement.toFixed(1)}</li>
              <li>Conformation: {point.conformation.toFixed(1)}</li>
              <li>Muscle Development: {point.muscleDevelopment.toFixed(1)}</li>
              <li>Breed Characteristics: {point.breedCharacteristics.toFixed(1)}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}