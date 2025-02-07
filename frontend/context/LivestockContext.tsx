"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { clientPromise, ObjectId } from '../services/mongodb';
import type { Animal } from '../types';
import { Document } from 'mongodb';

interface AnimalDocument extends Document {
  name: string;
  category: string;
  breed: string;
  region: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
  createdAt: Date;
}

interface LivestockContextType {
  animals: Animal[];
  loading: boolean;
  error: Error | null;
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<void>;
  updateAnimal: (id: string, updates: Partial<Animal>) => Promise<void>;
  getAnimal: (id: string) => Animal | undefined;
}

const LivestockContext = createContext<LivestockContextType | undefined>(undefined);

const mapDocumentToAnimal = (doc: AnimalDocument): Animal => ({
  id: doc._id.toString(),
  name: doc.name,
  category: doc.category,
  breed: doc.breed,
  region: doc.region,
  scores: doc.scores,
  notes: doc.notes,
  images: doc.images,
});

export function LivestockProvider({ children }: { children: React.ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const data = await db
        .collection<AnimalDocument>('animals')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      setAnimals(data.map(mapDocumentToAnimal));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch animals'));
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animal: Omit<Animal, 'id'>) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection<AnimalDocument>('animals')
        .insertOne({
          ...animal,
          createdAt: new Date(),
        } as AnimalDocument);

      const newAnimal: Animal = {
        id: result.insertedId.toString(),
        ...animal,
      };

      setAnimals(prev => [newAnimal, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add animal'));
      throw err;
    }
  };

  const updateAnimal = async (id: string, updates: Partial<Animal>) => {
    try {
      const client = await clientPromise;
      const db = client.db();
      const result = await db
        .collection<AnimalDocument>('animals')
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updates },
          { returnDocument: 'after' }
        );

      if (!result) throw new Error('Animal not found');

      const updatedAnimal = mapDocumentToAnimal(result);
      setAnimals(prev =>
        prev.map(animal => (animal.id === id ? updatedAnimal : animal))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update animal'));
      throw err;
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