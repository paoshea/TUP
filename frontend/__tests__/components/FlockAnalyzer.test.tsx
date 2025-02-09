import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { mockUseAI } from '@/utils/test-utils';
import type { Animal } from '@/types';

// Mock the useAI hook
jest.mock('@/hooks/useAI', () => ({
  useAI: () => mockUseAI()
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
  });

  it('renders animal list', async () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Animal 1')).toBeInTheDocument();
      expect(screen.getByText('Test Animal 2')).toBeInTheDocument();
    });
  });

  it('allows animal selection', async () => {
    const mockAnalyzeAnimal = jest.fn().mockResolvedValue({
      insights: ['Test insight'],
      recommendations: ['Test recommendation']
    });

    jest.spyOn(mockUseAI(), 'analyzeAnimal').mockImplementation(mockAnalyzeAnimal);

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = await waitFor(() => screen.getAllByText('Analyze')[0]);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal 1')).toBeInTheDocument();
    });
  });

  it('displays analysis results', async () => {
    const mockAnalysis = {
      insights: ['Test insight'],
      recommendations: ['Test recommendation'],
      confidence: 85
    };

    jest.spyOn(mockUseAI(), 'analyzeAnimal').mockResolvedValue(mockAnalysis);

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = await waitFor(() => screen.getAllByText('Analyze')[0]);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Key Insights')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Test insight')).toBeInTheDocument();
      expect(screen.getByText('Test recommendation')).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    // Mock a delayed analysis to show loading state
    const mockAnalyzeAnimal = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    jest.spyOn(mockUseAI(), 'analyzeAnimal').mockImplementation(mockAnalyzeAnimal);
    jest.spyOn(mockUseAI(), 'loading', 'get').mockReturnValue(true);

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = await waitFor(() => screen.getAllByText('Analyze')[0]);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    });
  });

  it('displays error state', async () => {
    // Mock the error state
    const mockError = new Error('An error occurred during analysis');
    jest.spyOn(mockUseAI(), 'analyzeAnimal').mockRejectedValue(mockError);
    jest.spyOn(mockUseAI(), 'error', 'get').mockReturnValue(mockError);

    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = await waitFor(() => screen.getAllByText('Analyze')[0]);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText(/an error occurred during analysis/i)).toBeInTheDocument();
    });
  });
});