import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/mock/store';
import { useState } from 'react';
import type { DemoComponentProps } from '../types';
import type { Show } from '@/lib/types/mock';

export function ShowDemo({ isLoading, onAction }: DemoComponentProps) {
  const [shows, setShows] = useState<Show[]>([]);

  const handleLoadShows = async () => {
    const demoShows = mockStore.getShows();
    setShows(demoShows);
    onAction?.();
  };

  const getStatusColor = (status: Show['status']) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Show Management Demo</h3>
        <Button
          onClick={handleLoadShows}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Load Shows
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {shows.map((show) => (
          <Card key={show.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{show.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(show.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(show.status)} capitalize`}>
                  {show.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Location: {show.location}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Categories:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {show.categories.map((category) => (
                      <span
                        key={category}
                        className="text-xs bg-secondary px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {show.entries && show.entries.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Entries: {show.entries.length}</p>
                  <div className="mt-2 space-y-2">
                    {show.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="text-sm flex justify-between items-center bg-secondary/50 p-2 rounded"
                      >
                        <span>Animal ID: {entry.animalId}</span>
                        {entry.placement && (
                          <span className="font-medium">
                            Place: {entry.placement}
                            {entry.score && ` (${entry.score})`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Load Shows" to see demo data
        </div>
      )}
    </div>
  );
}