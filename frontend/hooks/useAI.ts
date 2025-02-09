import { useState } from 'react';
import { aiService } from '@/services/ai';
import type { Animal } from '../types';

interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface AIState {
  analysis: AIAnalysis | null;
  loading: boolean;
  error: Error | null;
}

interface HistoricalComparison {
  improvements: string[];
  trends: Record<string, number>;
  predictions: string[];
}

export function useAI() {
  const [state, setState] = useState<AIState>({
    analysis: null,
    loading: false,
    error: null
  });

  const analyzeAnimal = async (animal: Animal) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await aiService.processMessage(
        `Analyze this animal's performance metrics: ${JSON.stringify(animal)}`
      );

      setState(prev => ({
        ...prev,
        loading: false,
        analysis: {
          insights: response.suggestions || [],
          recommendations: response.relatedTopics || [],
          confidence: 0.8 // Default confidence level
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Analysis failed')
      }));
    }
  };

  const getRecommendations = async (animalId: string): Promise<string[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await aiService.processMessage(
        `Get recommendations for animal ${animalId}`
      );
      
      setState(prev => ({ ...prev, loading: false }));
      return response.suggestions || [];
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to get recommendations')
      }));
      return [];
    }
  };

  const compareWithHistorical = async (animalId: string): Promise<HistoricalComparison> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await aiService.processMessage(
        `Compare historical performance for animal ${animalId}`
      );
      
      setState(prev => ({ ...prev, loading: false }));
      return {
        improvements: response.suggestions || [],
        trends: {},  // Would be populated with actual trend data
        predictions: response.relatedTopics || []
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to compare historical data')
      }));
      return {
        improvements: [],
        trends: {},
        predictions: []
      };
    }
  };

  const resetAnalysis = () => {
    setState({
      analysis: null,
      loading: false,
      error: null
    });
  };

  return {
    ...state,
    analyzeAnimal,
    getRecommendations,
    compareWithHistorical,
    resetAnalysis
  };
}