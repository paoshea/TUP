import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/EvaluationForm';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { mockUsePhotos, mockUseAI } from '@/utils/test-utils';
import type { Animal } from '@/types';

// Mock hooks
jest.mock('@/hooks/usePhotos', () => ({
  usePhotos: () => mockUsePhotos()
}));

jest.mock('@/hooks/useAI', () => ({
  useAI: () => mockUseAI()
}));

describe('Evaluation Flow', () => {
  const mockAnimal: Animal = {
    id: 'test-animal-123',
    name: 'Test Animal',
    category: 'livestock',
    breed: 'Test Breed',
    region: 'Test Region',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8
    }
  };

  const mockEvaluation = {
    id: 'test-eval-123',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8
    },
    notes: 'Test evaluation notes',
    images: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    jest.spyOn(mockUseAI(), 'analyzeAnimal').mockResolvedValue({
      insights: ['Test insight'],
      recommendations: ['Test recommendation'],
      confidence: 85
    });
  });

  it('completes full evaluation process', async () => {
    const mockSave = jest.fn().mockResolvedValue({ id: 'new-eval-123' });
    
    const { container } = render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={mockSave}
          initialData={mockEvaluation}
        />
      </>
    );

    // Select animal and wait for analysis
    const analyzeButton = await waitFor(() => screen.getByText('Analyze'));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal')).toBeInTheDocument();
    });

    // Update scores
    const movementInput = await waitFor(() => screen.getByLabelText(/movement/i));
    fireEvent.change(movementInput, { target: { value: '9' } });

    // Add notes
    const notesInput = await waitFor(() => screen.getByLabelText(/notes/i));
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    // Upload photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await waitFor(() => {
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        });
        fireEvent.change(fileInput);
      }
    });

    // Verify photo upload
    await waitFor(() => {
      expect(mockUsePhotos().uploadPhoto).toHaveBeenCalledWith(file);
    });

    // Save evaluation
    const saveButton = await waitFor(() => screen.getByText(/save/i));
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
        scores: expect.objectContaining({
          movement: 9
        }),
        notes: 'Updated notes'
      }));
    });
  });

  it('handles validation and error states', async () => {
    const mockError = new Error('Save failed');
    const failedSave = jest.fn().mockRejectedValue(mockError);

    render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={failedSave}
          initialData={mockEvaluation}
        />
      </>
    );

    // Select animal and wait for analysis
    const analyzeButton = await waitFor(() => screen.getByText('Analyze'));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal')).toBeInTheDocument();
    });

    // Enter invalid score
    const movementInput = await waitFor(() => screen.getByLabelText(/movement/i));
    fireEvent.change(movementInput, { target: { value: '11' } });

    // Try to save
    const saveButton = await waitFor(() => screen.getByText(/save/i));
    fireEvent.click(saveButton);

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/must be between 0 and 10/i)).toBeInTheDocument();
    });

    // Fix score and try again
    fireEvent.change(movementInput, { target: { value: '9' } });
    fireEvent.click(saveButton);

    // Check save error
    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });

  it('integrates with photo upload', async () => {
    const { container } = render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={jest.fn()}
          initialData={mockEvaluation}
        />
      </>
    );

    // Select animal and wait for analysis
    const analyzeButton = await waitFor(() => screen.getByText('Analyze'));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal')).toBeInTheDocument();
    });

    // Upload photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await waitFor(() => {
      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      if (fileInput) {
        Object.defineProperty(fileInput, 'files', {
          value: [file]
        });
        fireEvent.change(fileInput);
      }
    });

    await waitFor(() => {
      expect(mockUsePhotos().uploadPhoto).toHaveBeenCalledWith(file);
    });
  });
});