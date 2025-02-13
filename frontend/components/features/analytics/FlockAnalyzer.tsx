import React, { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import type { Animal } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface FlockAnalyzerProps {
  animals: Animal[];
}

export function FlockAnalyzer({ animals }: FlockAnalyzerProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const { loading, error, analysis, analyzeAnimal, getRecommendations, compareWithHistorical, resetAnalysis } = useAI();

  const handleAnalyze = async (animal: Animal) => {
    setSelectedAnimal(animal);
    try {
      await analyzeAnimal(animal);
      await getRecommendations(animal.id);
      await compareWithHistorical(animal.id);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Flock Analysis</h2>

      {/* Animal List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => (
          <Card key={animal.id} className="p-4">
            <h3 className="font-semibold">{animal.name}</h3>
            <p className="text-sm text-gray-600">{animal.breed}</p>
            <div className="mt-4">
              <Button
                onClick={() => handleAnalyze(animal)}
                disabled={loading}
              >
                {loading && selectedAnimal?.id === animal.id ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-4">
          <Spinner data-testid="loading-spinner" />
          <span className="ml-2">Analyzing...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-500 p-4">
          {error.message}
        </div>
      )}

      {/* Analysis Results */}
      {selectedAnimal && analysis && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Analysis Results for {selectedAnimal.name}
          </h3>
          
          {/* Insights */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Insights</h4>
            <ul className="list-disc pl-5">
              {analysis.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="list-disc pl-5">
              {analysis.recommendations?.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          {/* Historical Comparison */}
          {analysis.historical && (
            <>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Improvements</h4>
                <ul className="list-disc pl-5">
                  {analysis.historical.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Predictions</h4>
                <ul className="list-disc pl-5">
                  {analysis.historical.predictions.map((prediction, index) => (
                    <li key={index}>{prediction}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="mt-4">
            <Button onClick={resetAnalysis} variant="outline">
              Reset Analysis
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}