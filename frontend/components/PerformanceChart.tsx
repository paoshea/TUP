"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface PerformanceData {
  date: string;
  movement: number;
  conformation: number;
  muscleDevelopment: number;
  breedCharacteristics: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

const METRICS = {
  movement: { color: '#8884d8', name: 'Movement' },
  conformation: { color: '#82ca9d', name: 'Conformation' },
  muscleDevelopment: { color: '#ffc658', name: 'Muscle Development' },
  breedCharacteristics: { color: '#ff7300', name: 'Breed Characteristics' }
} as const;

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({
  data,
  title = 'Performance Trends',
  height = 300,
  showLegend = true,
  className = ''
}: PerformanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) => value.toFixed(1)}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value: string) => {
                    const metric = Object.entries(METRICS).find(
                      ([, m]) => m.name === value
                    );
                    return metric ? metric[1].name : value;
                  }}
                />
              )}
              {Object.entries(METRICS).map(([key, { color, name }]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  name={name}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}