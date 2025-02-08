"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { EvaluationForm } from '@/components/EvaluationForm';
import { Progress } from '@/components/ui/progress';
import { Award, BarChart, ClipboardCheck, FileText } from 'lucide-react';
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
                <Card key={animal.id} className="border-t-4 border-t-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-500" />
                        {animal.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{animal.breed}</span>
                        <span>•</span>
                        <span>{animal.age} years</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart className="h-5 w-5 text-purple-500" />
                          <h3 className="text-lg font-medium">Current Scores</h3>
                        </div>
                        <div className="space-y-4 bg-purple-50/50 dark:bg-purple-950/50 p-4 rounded-lg">
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

                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-purple-500" />
                            <h4 className="font-medium">Notes</h4>
                          </div>
                          <p className="text-sm text-muted-foreground bg-purple-50/50 dark:bg-purple-950/50 p-3 rounded-lg">
                            {animal.notes}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <ClipboardCheck className="h-5 w-5 text-purple-500" />
                          <h3 className="text-lg font-medium">New Evaluation</h3>
                        </div>
                        <div className="bg-purple-50/50 dark:bg-purple-950/50 p-4 rounded-lg">
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