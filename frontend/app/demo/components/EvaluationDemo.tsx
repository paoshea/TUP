import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockStore } from '@/lib/mock/store';
import { useState } from 'react';
import type { DemoComponentProps } from '../types';
import type { Evaluation } from '@/lib/types/mock';

export function EvaluationDemo({ isLoading, onAction }: DemoComponentProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const handleLoadEvaluations = async () => {
    const demoEvaluations = mockStore.getEvaluations();
    setEvaluations(demoEvaluations);
    onAction?.();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-green-600';
    if (score >= 6) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Evaluation System Demo</h3>
        <Button
          onClick={handleLoadEvaluations}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Load Evaluations
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Evaluation #{evaluation.id}</h4>
                  <p className="text-sm text-gray-500">
                    Animal ID: {evaluation.animalId}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(evaluation.scores).map(([category, score]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="capitalize">{category}</span>
                      <span className={getScoreColor(score)}>{score}/10</span>
                    </div>
                    <Progress
                      value={score * 10}
                      className="bg-gray-100"
                      indicatorClassName={getProgressColor(score)}
                    />
                  </div>
                ))}
              </div>

              {evaluation.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm text-gray-600">{evaluation.notes}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {evaluations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Load Evaluations" to see demo data
        </div>
      )}
    </div>
  );
}