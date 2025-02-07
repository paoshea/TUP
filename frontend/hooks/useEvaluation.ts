import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Animal } from '../types';

export function useEvaluation(animalId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [evaluation, setEvaluation] = useState<Animal | null>(null);

  const fetchEvaluation = useCallback(async () => {
    if (!animalId) return;
    
    try {
      setLoading(true);
      const data = await api.animals.get(animalId);
      setEvaluation(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch evaluation'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  const saveEvaluation = async (data: Partial<Animal>) => {
    try {
      setLoading(true);
      if (animalId) {
        const updated = await api.animals.update(animalId, data);
        setEvaluation(updated);
      } else {
        const created = await api.animals.create(data as Omit<Animal, 'id'>);
        setEvaluation(created);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save evaluation'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    evaluation,
    loading,
    error,
    fetchEvaluation,
    saveEvaluation,
  };
}