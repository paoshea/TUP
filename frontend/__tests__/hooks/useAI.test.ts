import { renderHook, act } from '@testing-library/react';
import { useAI } from '../../hooks/useAI';
import { ai } from '../../services/ai';

// Mock the AI service
jest.mock('../../services/ai', () => ({
  ai: {
    analyzeAnimal: jest.fn(),
    getRecommendations: jest.fn(),
    compareWithHistorical: jest.fn(),
  },
}));

describe('useAI', () => {
  const mockAnimal = {
    id: '123',
    name: 'Test Animal',
    category: 'Sheep',
    breed: 'Suffolk',
    region: 'Highland',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8,
    },
    notes: 'Test notes',
    images: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with no error and not loading', () => {
    const { result } = renderHook(() => useAI());
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles animal analysis', async () => {
    const mockAnalysis = {
      score: 85,
      recommendations: ['Improve movement'],
      comparisons: [
        {
          flockName: 'Test Flock',
          similarity: 90,
          strengths: ['Good conformation'],
          improvements: ['Work on movement'],
        },
      ],
    };

    (ai.analyzeAnimal as jest.Mock).mockResolvedValueOnce(mockAnalysis);

    const { result } = renderHook(() => useAI());

    let analysis;
    await act(async () => {
      analysis = await result.current.analyzeAnimal(mockAnimal);
    });

    expect(analysis).toEqual(mockAnalysis);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(ai.analyzeAnimal).toHaveBeenCalledWith(mockAnimal);
  });

  it('handles recommendations retrieval', async () => {
    const mockRecommendations = ['Focus on movement', 'Improve muscle definition'];
    (ai.getRecommendations as jest.Mock).mockResolvedValueOnce(mockRecommendations);

    const { result } = renderHook(() => useAI());

    let recommendations;
    await act(async () => {
      recommendations = await result.current.getRecommendations('123');
    });

    expect(recommendations).toEqual(mockRecommendations);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(ai.getRecommendations).toHaveBeenCalledWith('123');
  });

  it('handles historical comparison', async () => {
    const mockComparison = {
      similarFlocks: ['Test Flock 1', 'Test Flock 2'],
      analysis: 'Test analysis',
    };
    (ai.compareWithHistorical as jest.Mock).mockResolvedValueOnce(mockComparison);

    const { result } = renderHook(() => useAI());

    let comparison;
    await act(async () => {
      comparison = await result.current.compareWithHistorical('123');
    });

    expect(comparison).toEqual(mockComparison);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(ai.compareWithHistorical).toHaveBeenCalledWith('123');
  });

  it('handles analysis error', async () => {
    const error = new Error('Analysis failed');
    (ai.analyzeAnimal as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAI());

    await expect(
      act(async () => {
        await result.current.analyzeAnimal(mockAnimal);
      })
    ).rejects.toThrow('Analysis failed');

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('handles recommendations error', async () => {
    const error = new Error('Recommendations failed');
    (ai.getRecommendations as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAI());

    await expect(
      act(async () => {
        await result.current.getRecommendations('123');
      })
    ).rejects.toThrow('Recommendations failed');

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('handles historical comparison error', async () => {
    const error = new Error('Historical comparison failed');
    (ai.compareWithHistorical as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAI());

    await expect(
      act(async () => {
        await result.current.compareWithHistorical('123');
      })
    ).rejects.toThrow('Historical comparison failed');

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });
});