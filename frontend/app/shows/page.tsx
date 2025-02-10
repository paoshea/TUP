"use client";

import { useState } from 'react';
import { WifiOff } from 'lucide-react';
import { RegionalInsights } from '@/components/analytics';
import { PreShowChecklist } from '@/components/features/shows';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function ShowsPage() {
  const [selectedShow, setSelectedShow] = useState(null);
  const { isOnline } = useOfflineSync();
  const shows = mockStore.getShows();
  const upcomingShows = shows.filter(show => show.status === 'upcoming');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shows</h1>
          <Button
            onClick={() => window.location.href = '/shows/new'}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Add Show
          </Button>
        </div>

        {/* Offline Warning */}
        {!isOnline && (
          <Card className="bg-yellow-50 p-4">
            <div className="flex items-center text-yellow-800">
              <WifiOff className="h-5 w-5 mr-2" />
              <p>You're currently offline. Some features may be limited.</p>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shows List */}
          <div className="lg:col-span-2 space-y-4">
            {upcomingShows.length > 0 ? (
              upcomingShows.map(show => (
                <Card
                  key={show.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedShow(show)}
                >
                  <h3 className="font-semibold text-lg">{show.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(show.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">{show.location}</p>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No upcoming shows</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Regional Insights */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Regional Insights</h2>
              <RegionalInsights />
            </Card>

            {/* Pre-Show Checklist */}
            {selectedShow && (
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Show Checklist</h2>
                <PreShowChecklist show={selectedShow} />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}