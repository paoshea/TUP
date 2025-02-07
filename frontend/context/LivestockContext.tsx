"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Animal } from '../types';

interface LivestockContextType {
  animals: Animal[];
  loading: boolean;
  error: Error | null;
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<void>;
  updateAnimal: (id: string, updates: Partial<Animal>) => Promise<void>;
  getAnimal: (id: string) => Animal | undefined;
}

const LivestockContext = createContext<LivestockContextType | undefined>(undefined);

export function LivestockProvider({ children }: { children: React.ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch('/api/animals');
      if (!response.ok) {
        throw new Error('Failed to fetch animals');
      }
      const data = await response.json();
      setAnimals(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animal: Omit<Animal, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      });

      if (!response.ok) {
        throw new Error('Failed to create animal');
      }

      const newAnimal = await response.json();
      setAnimals(prev => [newAnimal, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add animal'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnimal = async (id: string, updates: Partial<Animal>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/animals?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update animal');
      }

      const updatedAnimal = await response.json();
      setAnimals(prev =>
        prev.map(animal => (animal.id === id ? updatedAnimal : animal))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update animal'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAnimal = (id: string) => animals.find(animal => animal.id === id);

  return (
    <LivestockContext.Provider
      value={{
        animals,
        loading,
        error,
        addAnimal,
        updateAnimal,
        getAnimal,
      }}
    >
      {children}
    </LivestockContext.Provider>
  );
}

export const useLivestock = () => {
  const context = useContext(LivestockContext);
  if (context === undefined) {
    throw new Error('useLivestock must be used within a LivestockProvider');
  }
  return context;
};