"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { EvaluationForm } from '@/components/EvaluationForm';
import { Progress } from '@/components/ui/progress';
import type { Animal } from '@/lib/types/mock';

export default function EvaluationsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    setAnimals(mockStore.getAnimals());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Evaluations
        </h1>

        <div className="grid gap-6">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">Evaluation History</h2>
            <div className="grid gap-4">
              {animals.map(animal => (
                <Card key={animal.id}>
                  <CardHeader>
                    <CardTitle>{animal.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Details</h4>
                          <dl className="space-y-2">
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Breed</dt>
                              <dd>{animal.breed}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-muted-foreground">Age</dt>
                              <dd>{animal.age} years</dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Scores</h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Movement</span>
                                <span className="text-muted-foreground">{animal.scores.movement}/10</span>
                              </div>
                              <Progress value={animal.scores.movement * 10} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Conformation</span>
                                <span className="text-muted-foreground">{animal.scores.conformation}/10</span>
                              </div>
                              <Progress value={animal.scores.conformation * 10} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Muscle Development</span>
                                <span className="text-muted-foreground">{animal.scores.muscleDevelopment}/10</span>
                              </div>
                              <Progress value={animal.scores.muscleDevelopment * 10} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Breed Characteristics</span>
                                <span className="text-muted-foreground">{animal.scores.breedCharacteristics}/10</span>
                              </div>
                              <Progress value={animal.scores.breedCharacteristics * 10} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                        <p className="text-sm">{animal.notes}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-4">New Evaluation</h4>
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
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}