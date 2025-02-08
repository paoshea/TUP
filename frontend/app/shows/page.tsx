"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { RegionalInsights } from '@/components/RegionalInsights';
import { PreShowChecklist } from '@/components/PreShowChecklist';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Show } from '@/lib/types/mock';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    setShows(mockStore.getShows());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Show Management
        </h1>

        <div className="grid gap-6">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Upcoming Shows</h2>
            <div className="grid gap-4">
              {shows.map(show => (
                <Card key={show.id} className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {show.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(show.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{show.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Participants</p>
                          <p className="text-sm text-muted-foreground">{show.participants}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {show.categories.map(category => (
                          <Badge key={category} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Show Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <PreShowChecklist />
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Regional Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <RegionalInsights />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}