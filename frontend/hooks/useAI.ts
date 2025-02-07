"use client";

import { useState } from 'react';
import { ai } from '../services/ai';
import type { Animal } from '../types';

interface AIAnalysis {
  score: number;
  recommendations: string[];
  comparisons: {
    flockName: string;
    similarity: number;
    strengths: string[];
    improvements: string[];
  }[];
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyzeAnimal = async (animal: Animal): Promise<AIAnalysis> => {
    try {
      setLoading(true);
      setError(null);
      return await ai.analyzeAnimal(animal);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze animal');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (animalId: string): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      return await ai.getRecommendations(animalId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get recommendations');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const compareWithHistorical = async (animalId: string): Promise<{
    similarFlocks: string[];
    analysis: string;
  }> => {
    try {
      setLoading(true);
      setError(null);
      return await ai.compareWithHistorical(animalId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to compare with historical data');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeAnimal,
    getRecommendations,
    compareWithHistorical,
    loading,
    error,
  };
}