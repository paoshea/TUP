import { render, screen, fireEvent } from '@testing-library/react';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import type { Animal } from '@/types';

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

  it('renders animal list', () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    expect(screen.getByText('Test Animal 1')).toBeInTheDocument();
    expect(screen.getByText('Test Animal 2')).toBeInTheDocument();
  });

  it('allows animal selection', async () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    expect(await screen.findByText('Analysis Results for Test Animal 1')).toBeInTheDocument();
  });

  it('displays analysis results', async () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    expect(await screen.findByText('Key Insights')).toBeInTheDocument();
    expect(await screen.findByText('Recommendations')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    render(<FlockAnalyzer animals={mockAnimals} />);
    
    // Force an error state
    const analyzeButton = screen.getAllByText('Analyze')[0];
    fireEvent.click(analyzeButton);

    // Error message should appear (from mock AI service error)
    expect(await screen.findByText(/error occurred/i)).toBeInTheDocument();
  });
});