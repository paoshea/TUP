"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { PhotoGallery } from '@/components/PhotoGallery';
import { EvaluationForm } from '@/components/EvaluationForm';
import { Progress } from '@/components/ui/progress';
import { Scale, Ruler, Award, Camera } from 'lucide-react';
import type { Animal } from '@/lib/types/mock';

export default function AnimalsWrapper() {
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
            <Card key={animal.id} className="border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {animal.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Details</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
                        <Award className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Breed</p>
                          <p className="text-sm text-muted-foreground">{animal.breed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
                        <Ruler className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Age</p>
                          <p className="text-sm text-muted-foreground">{animal.age} years</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
                        <Scale className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Weight</p>
                          <p className="text-sm text-muted-foreground">{animal.weight} kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Photos</h3>
                      <Camera className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="bg-blue-50/50 dark:bg-blue-950/50 p-4 rounded-lg">
                      <PhotoGallery
                        photos={animal.images}
                        onPhotosChange={(photos) => {
                          console.log('Photos updated:', photos);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Card className="border-t-4 border-t-purple-500">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Performance Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Movement</span>
                              <span className="text-muted-foreground">{animal.scores.movement}/10</span>
                            </div>
                            <Progress value={animal.scores.movement * 10} className="bg-purple-100 dark:bg-purple-950">
                              <div className="h-full bg-purple-500" style={{ width: `${animal.scores.movement * 10}%` }} />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Conformation</span>
                              <span className="text-muted-foreground">{animal.scores.conformation}/10</span>
                            </div>
                            <Progress value={animal.scores.conformation * 10} className="bg-purple-100 dark:bg-purple-950">
                              <div className="h-full bg-purple-500" style={{ width: `${animal.scores.conformation * 10}%` }} />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Muscle Development</span>
                              <span className="text-muted-foreground">{animal.scores.muscleDevelopment}/10</span>
                            </div>
                            <Progress value={animal.scores.muscleDevelopment * 10} className="bg-purple-100 dark:bg-purple-950">
                              <div className="h-full bg-purple-500" style={{ width: `${animal.scores.muscleDevelopment * 10}%` }} />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Breed Characteristics</span>
                              <span className="text-muted-foreground">{animal.scores.breedCharacteristics}/10</span>
                            </div>
                            <Progress value={animal.scores.breedCharacteristics * 10} className="bg-purple-100 dark:bg-purple-950">
                              <div className="h-full bg-purple-500" style={{ width: `${animal.scores.breedCharacteristics * 10}%` }} />
                            </Progress>
                          </div>
                        </div>
                        <div>
                          <EvaluationForm
                            initialData={{
                              id: animal.id,
                              scores: animal.scores,
                              notes: '',
                              images: [],
                            }}
                            onSave={(data) => {
                              console.log('Evaluation saved:', data);
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}