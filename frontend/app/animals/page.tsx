"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { PhotoGallery } from '@/components/PhotoGallery';
import { EvaluationForm } from '@/components/EvaluationForm';
import type { Animal } from '@/lib/types/mock';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    setAnimals(mockStore.getAnimals());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Animal Management
        </h1>

        <div className="grid gap-6">
          {animals.map(animal => (
            <Card key={animal.id}>
              <CardHeader>
                <CardTitle>{animal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Details</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Breed</dt>
                        <dd>{animal.breed}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Age</dt>
                        <dd>{animal.age} years</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Weight</dt>
                        <dd>{animal.weight} kg</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Photos</h3>
                    <PhotoGallery
                      photos={animal.images}
                      onPhotosChange={(photos) => {
                        console.log('Photos updated:', photos);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Evaluation</h3>
                  <EvaluationForm
                    initialData={{
                      id: animal.id,
                      scores: animal.scores,
                      notes: animal.notes,
                      images: animal.images,
                    }}
                    onSave={(data) => {
                      console.log('Evaluation saved:', data);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}