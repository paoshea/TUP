import React, { useState } from 'react';
import { useAI } from '@/hooks/useAI';

interface FlockAnalyzerProps {
  onAnimalSelect?: (animalId: string | null) => void;
}

export function FlockAnalyzer({ onAnimalSelect }: FlockAnalyzerProps) {
  const [selectedFlock, setSelectedFlock] = useState<string | null>(null);
  const [view, setView] = useState<'historical' | 'analysis'>('historical');
  const { loading, error } = useAI();

  const handleFlockSelect = (flockName: string) => {
    setSelectedFlock(flockName);
    // In a real app, we would get the actual animal ID
    onAnimalSelect?.('sample-animal-id');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setView('historical')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                view === 'historical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Historical Data
          </button>
          <button
            onClick={() => setView('analysis')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                view === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Analysis
          </button>
        </nav>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500">{error.message}</p>
        </div>
      )}

      {view === 'historical' ? (
        <div className="space-y-4">
          <div
            className={`
              p-4 border rounded-lg cursor-pointer
              ${
                selectedFlock === "Queen Mother&apos;s Caithness Flock"
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }
            `}
            onClick={() => handleFlockSelect("Queen Mother&apos;s Caithness Flock")}
          >
            <h3 className="text-lg font-semibold">Queen Mother&apos;s Caithness Flock</h3>
            {selectedFlock === "Queen Mother&apos;s Caithness Flock" && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">Est. 1952</p>
                <p className="text-sm text-gray-600">Show Performance: 95%</p>
                <div className="mt-4">
                  <h4 className="font-medium">Notable Traits</h4>
                  <p className="text-sm text-gray-600">
                    Exceptional breed character, strong maternal lines
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">
            Select a flock from the historical data to view detailed analysis.
          </p>
        </div>
      )}

      {selectedFlock && view === 'historical' && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Breeding Success</h4>
              <p className="text-2xl font-bold text-blue-600">92%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Conformation</h4>
              <p className="text-2xl font-bold text-blue-600">94%</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Wool Quality</h4>
              <p className="text-2xl font-bold text-blue-600">88%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}