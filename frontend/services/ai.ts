import type { Animal } from '@/types';

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

export const ai = {
  async analyzeAnimal(animal: Animal): Promise<AIAnalysis> {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ animal }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze animal');
    }

    return response.json();
  },

  async getRecommendations(animalId: string): Promise<string[]> {
    const response = await fetch(`/api/ai/recommendations?animalId=${animalId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get recommendations');
    }

    const data = await response.json();
    return data.recommendations;
  },

  async compareWithHistorical(animalId: string): Promise<{
    similarFlocks: string[];
    analysis: string;
  }> {
    const response = await fetch(`/api/ai/historical-comparison?animalId=${animalId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to compare with historical data');
    }

    return response.json();
  },
};