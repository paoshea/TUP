import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import type { Animal } from '@/types';

// Create a complete mock implementation
const mockAIHook = {
  loading: false,
  error: null as Error | null,
  analysis: null as { insights: string[]; confidence: number } | null,
  analyzeAnimal: jest.fn().mockResolvedValue({
    insights: ['Test insight'],
    confidence: 0.85
  }),
  getRecommendations: jest.fn().mockResolvedValue(['Test recommendation']),
  compareWithHistorical: jest.fn().mockResolvedValue({
    improvements: ['Test improvement'],
    trends: { 'Test Metric': 5 },
    predictions: ['Test prediction']
  }),
  resetAnalysis: jest.fn()
};

// Mock the useAI hook
jest.mock('@/hooks/useAI', () => ({
  useAI: () => mockAIHook
}));

describe('FlockAnalyzer', () => {
  const mockAnimals: Animal[] = [
    {
      id: '1',
      name: 'Test Animal 1',
      category: 'livestock',
      breed: 'Test Breed',
      region: 'Test Region',
      scores: {
        movement: 8,
        conformation: 7,
        muscleDevelopment: 9,
        breedCharacteristics: 8
      }
    },
    {
      id: '2',
      name: 'Test Animal 2',
      category: 'livestock',
      breed: 'Test Breed',
      region: 'Test Region',
      scores: {
        movement: 7,
        conformation: 8,
        muscleDevelopment: 8,
        breedCharacteristics: 7
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockAIHook.loading = false;
    mockAIHook.error = null;
    mockAIHook.analysis = null;
  });

  it('renders animal list', () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    expect(screen.getByText('Test Animal 1')).toBeInTheDocument();
    expect(screen.getByText('Test Animal 2')).toBeInTheDocument();
  });

  it('handles analysis process', async () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    // Click analyze button for first animal
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });

    // Wait for analysis results
    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal 1')).toBeInTheDocument();
      expect(screen.getByText('Test insight')).toBeInTheDocument();
      expect(screen.getByText('Test recommendation')).toBeInTheDocument();
      expect(screen.getByText('Test improvement')).toBeInTheDocument();
      expect(screen.getByText('Test prediction')).toBeInTheDocument();
    });

    // Verify API calls
    expect(mockAIHook.analyzeAnimal).toHaveBeenCalledWith(mockAnimals[0]);
    expect(mockAIHook.getRecommendations).toHaveBeenCalledWith('1');
    expect(mockAIHook.compareWithHistorical).toHaveBeenCalledWith('1');
  });

  it('handles loading state', async () => {
    // Set loading state before render
    mockAIHook.loading = true;

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    // Click analyze button for first animal
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    // Wait for loading state
    await waitFor(() => {
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  it('displays error state', async () => {
    const mockError = new Error('An error occurred during analysis');
    mockAIHook.analyzeAnimal.mockRejectedValueOnce(mockError);

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    // Click analyze button for first animal
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('An error occurred during analysis')).toBeInTheDocument();
    });

    // Verify error state
    expect(mockAIHook.error).toBe(mockError);
  });
});