import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockStore } from '@/lib/mock/store';
import { useState } from 'react';
import type { DemoComponentProps } from '../types';
import type { Statistics } from '@/lib/types/mock';

export function AnalyticsDemo({ isLoading, onAction }: DemoComponentProps) {
  const [stats, setStats] = useState<Statistics | null>(null);

  const handleLoadAnalytics = async () => {
    const statistics = mockStore.getStatistics();
    setStats(statistics);
    onAction?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analytics Demo</h3>
        <Button
          onClick={handleLoadAnalytics}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Load Analytics
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Overview Card */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Overview</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Animals</p>
                <p className="text-2xl font-semibold">{stats.totalAnimals}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Evaluations</p>
                <p className="text-2xl font-semibold">{stats.totalEvaluations}</p>
              </div>
            </div>
          </Card>

          {/* Average Scores Card */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Average Scores</h4>
            <div className="space-y-4">
              {Object.entries(stats.averageScores).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">{category}</span>
                    <span className="text-sm font-medium">{score.toFixed(1)}</span>
                  </div>
                  <Progress value={score * 10} />
                </div>
              ))}
            </div>
          </Card>

          {/* Regional Breakdown Card */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Regional Breakdown</h4>
            <div className="space-y-4">
              {Object.entries(stats.regionalBreakdown).map(([region, count]) => (
                <div key={region}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{region}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <Progress
                    value={(count / stats.totalAnimals) * 100}
                    className="bg-blue-100"
                    indicatorClassName="bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Breed Distribution Card */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Breed Distribution</h4>
            <div className="space-y-4">
              {Object.entries(stats.breedDistribution).map(([breed, count]) => (
                <div key={breed}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{breed}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <Progress
                    value={(count / stats.totalAnimals) * 100}
                    className="bg-green-100"
                    indicatorClassName="bg-green-600"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {!stats && (
        <div className="text-center py-8 text-gray-500">
          Click "Load Analytics" to see demo data
        </div>
      )}
    </div>
  );
}