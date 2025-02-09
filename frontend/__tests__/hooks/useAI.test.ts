import { renderHook, act } from '@testing-library/react';
import { useAI } from '@/hooks/useAI';
import { aiService } from '@/services/ai';
import type { Animal } from '@/types';

// Mock the AI service
jest.mock('@/services/ai', () => ({
  aiService: {
    processMessage: jest.fn()
  }
}));

describe('useAI', () => {
  const mockAnimal: Animal = {
    id: '123',
    name: 'Test Animal',
    breed: 'Test Breed',
    category: 'livestock',
    region: 'test-region',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAI());

    expect(result.current.analysis).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should analyze animal successfully', async () => {
    const mockResponse = {
      content: 'Analysis complete',
      suggestions: ['Suggestion 1', 'Suggestion 2'],
      relatedTopics: ['Topic 1', 'Topic 2']
    };

    (aiService.processMessage as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAI());

    await act(async () => {
      await result.current.analyzeAnimal(mockAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.analysis).toEqual({
      insights: ['Suggestion 1', 'Suggestion 2'],
      recommendations: ['Topic 1', 'Topic 2'],
      confidence: 0.8
    });
  });

  it('should get recommendations successfully', async () => {
    const mockResponse = {
      content: 'Recommendations',
      suggestions: ['Rec 1', 'Rec 2']
    };

    (aiService.processMessage as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAI());
    let recommendations: string[] = [];

    await act(async () => {
      recommendations = await result.current.getRecommendations('123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(recommendations).toEqual(['Rec 1', 'Rec 2']);
  });

  it('should compare with historical data successfully', async () => {
    const mockResponse = {
      content: 'Historical comparison',
      suggestions: ['Improvement 1', 'Improvement 2'],
      relatedTopics: ['Prediction 1', 'Prediction 2']
    };

    (aiService.processMessage as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAI());
    let comparison;

    await act(async () => {
      comparison = await result.current.compareWithHistorical('123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(comparison).toEqual({
      improvements: ['Improvement 1', 'Improvement 2'],
      trends: {},
      predictions: ['Prediction 1', 'Prediction 2']
    });
  });

  it('should handle analysis error', async () => {
    const mockError = new Error('Analysis failed');
    (aiService.processMessage as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAI());

    await act(async () => {
      await result.current.analyzeAnimal(mockAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.analysis).toBeNull();
  });

  it('should handle recommendations error', async () => {
    const mockError = new Error('Failed to get recommendations');
    (aiService.processMessage as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAI());
    let recommendations: string[] = [];

    await act(async () => {
      recommendations = await result.current.getRecommendations('123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(recommendations).toEqual([]);
  });

  it('should handle historical comparison error', async () => {
    const mockError = new Error('Failed to compare historical data');
    (aiService.processMessage as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAI());
    let comparison;

    await act(async () => {
      comparison = await result.current.compareWithHistorical('123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(comparison).toEqual({
      improvements: [],
      trends: {},
      predictions: []
    });
  });

  it('should reset analysis state', () => {
    const { result } = renderHook(() => useAI());

    act(() => {
      result.current.resetAnalysis();
    });

    expect(result.current.analysis).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});