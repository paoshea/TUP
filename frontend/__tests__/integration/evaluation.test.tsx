import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  });

  it('completes full evaluation process', async () => {
    const mockSave = jest.fn();
    const { container } = render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={mockSave}
          initialData={mockEvaluation}
        />
      </>
    );

    // Select animal
    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    // Wait for analysis
    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal')).toBeInTheDocument();
    });

    // Update scores
    const movementInput = screen.getByLabelText(/movement/i);
    fireEvent.change(movementInput, { target: { value: '9' } });

    // Add notes
    const notesInput = screen.getByLabelText(/notes/i);
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    // Upload photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file]
      });
      fireEvent.change(fileInput);
    }

    // Save evaluation
    const saveButton = screen.getByText(/save/i);
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
    render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={() => Promise.reject(new Error('Save failed'))}
          initialData={mockEvaluation}
        />
      </>
    );

    // Select animal
    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    // Enter invalid score
    const movementInput = screen.getByLabelText(/movement/i);
    fireEvent.change(movementInput, { target: { value: '11' } });

    // Try to save
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    // Check validation error
    expect(await screen.findByText(/must be between 0 and 10/i)).toBeInTheDocument();

    // Fix score and try again
    fireEvent.change(movementInput, { target: { value: '9' } });
    fireEvent.click(saveButton);

    // Check save error
    expect(await screen.findByText(/failed to save/i)).toBeInTheDocument();
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

    // Select animal
    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);

    // Upload photo
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file]
      });
      fireEvent.change(fileInput);
    }

    await waitFor(() => {
      expect(mockUsePhotos().uploadPhoto).toHaveBeenCalledWith(file);
    });
  });
});