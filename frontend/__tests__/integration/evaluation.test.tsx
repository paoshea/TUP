import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/EvaluationForm';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { mockUseAI } from '@/utils/test-utils';
import type { Animal } from '@/types';

// Mock hooks
jest.mock('@/hooks/useAI', () => ({
  useAI: () => mockUseAI()
}));

// Mock useOfflineSync hook
jest.mock('@/hooks/useOfflineSync', () => ({
  useOfflineSync: () => ({
    isOnline: true,
    isSyncing: false,
    syncQueue: [],
    saveOffline: jest.fn(),
    syncQueuedItems: jest.fn().mockResolvedValue(undefined)
  })
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
    
    render(
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

    // Update scores using slider
    const movementSlider = await waitFor(() => 
      screen.getByLabelText('Movement Score').closest('.flex-1')
    );
    
    if (movementSlider) {
      fireEvent.change(movementSlider, { target: { value: '9' } });
    }

    // Add notes
    const notesInput = await waitFor(() => screen.getByLabelText('Evaluation Notes'));
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    // Save evaluation
    const saveButton = await waitFor(() => screen.getByText('Save Evaluation'));
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

    // Enter invalid score using slider
    const movementSlider = await waitFor(() => 
      screen.getByLabelText('Movement Score').closest('.flex-1')
    );
    
    if (movementSlider) {
      fireEvent.change(movementSlider, { target: { value: '11' } });
    }

    // Try to save
    const saveButton = await waitFor(() => screen.getByText('Save Evaluation'));
    fireEvent.click(saveButton);

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/must be between 0 and 10/i)).toBeInTheDocument();
    });

    // Fix score and try again
    if (movementSlider) {
      fireEvent.change(movementSlider, { target: { value: '9' } });
    }
    fireEvent.click(saveButton);

    // Check save error
    await waitFor(() => {
      expect(screen.getByText('Error saving evaluation. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles offline mode', async () => {
    // Mock offline mode
    jest.mock('@/hooks/useOfflineSync', () => ({
      useOfflineSync: () => ({
        isOnline: false,
        isSyncing: false,
        syncQueue: [],
        saveOffline: jest.fn().mockResolvedValue(undefined),
        syncQueuedItems: jest.fn().mockResolvedValue(undefined)
      })
    }));

    render(
      <>
        <FlockAnalyzer animals={[mockAnimal]} />
        <EvaluationForm
          onSave={jest.fn()}
          initialData={mockEvaluation}
        />
      </>
    );

    // Verify offline mode message
    await waitFor(() => {
      expect(screen.getByText('Offline Mode - Changes will sync when online')).toBeInTheDocument();
    });

    // Complete evaluation in offline mode
    const analyzeButton = await waitFor(() => screen.getByText('Analyze'));
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Analysis Results for Test Animal')).toBeInTheDocument();
    });

    // Save should trigger offline save
    const saveButton = await waitFor(() => screen.getByText('Save Evaluation'));
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Evaluation saved offline. Will sync when back online.')).toBeInTheDocument();
    });
  });
});