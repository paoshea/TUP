"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { RegionalInsights } from '@/components/RegionalInsights';
import { PreShowChecklist } from '@/components/PreShowChecklist';
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
                <Card key={show.id}>
                  <CardHeader>
                    <CardTitle>{show.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid md:grid-cols-3 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                        <dd>{new Date(show.date).toLocaleDateString()}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                        <dd>{show.location}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Participants</dt>
                        <dd>{show.participants}</dd>
                      </div>
                    </dl>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {show.categories.map(category => (
                          <span
                            key={category}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Show Preparation</h2>
            <PreShowChecklist />
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Regional Analysis</h2>
            <RegionalInsights />
          </section>
        </div>
      </main>
    </div>
  );
}