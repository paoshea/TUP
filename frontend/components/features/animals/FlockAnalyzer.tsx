import React, { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import type { Animal } from '@/types';

interface FlockAnalyzerProps {
  animals: Animal[];
}

export function FlockAnalyzer({ animals }: FlockAnalyzerProps) {
  const { loading, error, analysis, analyzeAnimal, getRecommendations, compareWithHistorical } = useAI();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{
    improvements: string[];
    trends: Record<string, number>;
    predictions: string[];
  } | null>(null);
  const [analysisError, setAnalysisError] = useState<Error | null>(null);

  const handleAnalyze = async (animal: Animal) => {
    try {
      setAnalysisError(null);
      setSelectedAnimal(animal);
      
      // Analyze animal
      await analyzeAnimal(animal);
      
      // Get additional insights
      const recs = await getRecommendations(animal.id);
      setRecommendations(recs);
      
      const comp = await compareWithHistorical(animal.id);
      setComparison(comp);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred during analysis');
      setAnalysisError(error);
      console.error('Analysis failed:', error);
    }
  };

  // Show either the hook error or the local error
  const displayError = error || analysisError;

  return (
    <ErrorBoundary>
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Flock Analysis</h2>
      
      {/* Error Display */}
      {displayError && (
        <Alert variant="destructive">
          <AlertDescription>
            {displayError.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Animal Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animals.map(animal => (
          <Card key={animal.id} className="p-4">
            <h3 className="font-semibold">{animal.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {animal.id}</p>
            <Button
              onClick={() => handleAnalyze(animal)}
              disabled={loading}
              className="mt-2"
            >
              {loading && selectedAnimal?.id === animal.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-testid="loading-spinner" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </Card>
        ))}
      </div>

      {/* Analysis Results */}
      {analysis && selectedAnimal && !displayError && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Analysis Results for {selectedAnimal.name}
          </h3>
          
          <div className="space-y-6">
            {/* Insights */}
            <div>
              <h4 className="font-medium mb-2">Key Insights</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="text-sm">{insight}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Historical Comparison */}
            {comparison && (
              <div>
                <h4 className="font-medium mb-2">Historical Comparison</h4>
                <div className="space-y-2">
                  {/* Improvements */}
                  <div>
                    <h5 className="text-sm font-medium">Improvements</h5>
                    <ul className="list-disc list-inside">
                      {comparison.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm">{improvement}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Trends */}
                  <div>
                    <h5 className="text-sm font-medium">Performance Trends</h5>
                    {Object.entries(comparison.trends).map(([metric, value]) => (
                      <div key={metric} className="flex justify-between text-sm">
                        <span>{metric}:</span>
                        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {value >= 0 ? '+' : ''}{value}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Predictions */}
                  <div>
                    <h5 className="text-sm font-medium">Predictions</h5>
                    <ul className="list-disc list-inside">
                      {comparison.predictions.map((prediction, index) => (
                        <li key={index} className="text-sm">{prediction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Confidence Score */}
            <div className="mt-4 text-sm text-muted-foreground">
              Analysis Confidence: {(analysis.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </Card>
      )}
    </div>
    </ErrorBoundary>
  );
}