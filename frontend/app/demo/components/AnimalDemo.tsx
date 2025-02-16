import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStore } from '@/lib/mock/store';
import { useState } from 'react';
import type { DemoComponentProps } from '../types';
import type { Animal } from '@/lib/types/mock';

export function AnimalDemo({ isLoading, onAction }: DemoComponentProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);

  const handleLoadAnimals = async () => {
    const demoAnimals = mockStore.getAnimals();
    setAnimals(demoAnimals);
    onAction?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Animal Management Demo</h3>
        <Button
          onClick={handleLoadAnimals}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Load Animals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animals.map((animal) => (
          <Card key={animal.id} className="p-4">
            <h4 className="font-medium">{animal.name}</h4>
            <p className="text-sm text-gray-500">Breed: {animal.breed}</p>
            <p className="text-sm text-gray-500">Region: {animal.region}</p>
            <div className="mt-2">
              <p className="text-sm">
                <strong>Category:</strong> {animal.category}
              </p>
              {animal.notes && (
                <p className="text-sm mt-1">
                  <strong>Notes:</strong> {animal.notes}
                </p>
              )}
            </div>
            {animal.images && animal.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {animal.images.length} photos available
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {animals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Load Animals" to see demo data
        </div>
      )}
    </div>
  );
}