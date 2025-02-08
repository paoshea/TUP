"use client";

import React, { useEffect, useState } from 'react';
import { mockStore } from '@/lib/mock/store';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { PreShowChecklist } from '@/components/PreShowChecklist';
import { PhotoGallery } from '@/components/PhotoGallery';
import { RegionalInsights } from '@/components/RegionalInsights';
import { EvaluationForm } from '@/components/EvaluationForm';
import { WizardPhil } from '@/components/WizardPhil';
import type { Animal, Statistics } from '@/lib/types/mock';

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    // Initialize data on the client side only
    const animals = mockStore.getAnimals();
    setSelectedAnimal(animals[0]);
    setStats(mockStore.getStatistics());
    setIsLoading(false);
  }, []);

  const handleSaveEvaluation = async (data: Partial<Animal>) => {
    console.log('Saving evaluation:', data);
    // In a real app, this would make an API call
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Demo System - Future State Preview
        </h1>
        
        <p className="text-muted-foreground">
          This demo showcases the future state of the TUP Livestock Management System
          using comprehensive mock data to demonstrate the full functionality.
        </p>

        <div className="grid gap-8">
          {/* Dashboard Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h2>
            <Dashboard />
          </section>

          {/* Evaluation Section */}
          {selectedAnimal && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">Animal Evaluation</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">New Evaluation</h3>
                  <EvaluationForm
                    onSave={handleSaveEvaluation}
                    initialData={{
                      id: selectedAnimal.id,
                      scores: selectedAnimal.scores,
                      notes: '',
                      images: [],
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Photo Management</h3>
                  <PhotoGallery
                    photos={selectedAnimal.images}
                    onPhotosChange={(photos) => {
                      console.log('Photos updated:', photos);
                    }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* Regional Insights Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Regional Analysis</h2>
            <RegionalInsights />
          </section>

          {/* Pre-Show Checklist Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Show Preparation</h2>
            <PreShowChecklist />
          </section>
        </div>
      </main>

      {/* AI Assistant */}
      <WizardPhil />

      {/* Statistics Summary */}
      {stats && (
        <footer className="border-t bg-muted/50 py-6 mt-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Animals</p>
                <p className="text-2xl font-semibold">{stats.totalAnimals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Shows</p>
                <p className="text-2xl font-semibold">{stats.upcomingShows}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Evaluations</p>
                <p className="text-2xl font-semibold">{stats.completedEvaluations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}