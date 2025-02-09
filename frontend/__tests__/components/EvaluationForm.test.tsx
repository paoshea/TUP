import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/EvaluationForm';
import * as useOfflineSyncModule from '@/hooks/useOfflineSync';

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

describe('EvaluationForm', () => {
  const mockOnSave = jest.fn().mockResolvedValue({ id: 'test-eval-123' });
  const mockInitialData = {
    id: 'test-eval-123',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8
    },
    notes: 'Initial notes',
    images: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all score categories', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Movement Score')).toBeInTheDocument();
      expect(screen.getByText('Conformation Score')).toBeInTheDocument();
      expect(screen.getByText('Muscle Development Score')).toBeInTheDocument();
      expect(screen.getByText('Breed Characteristics Score')).toBeInTheDocument();
    });
  });

  it('handles score changes', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const movementSlider = await waitFor(() => 
      screen.getByLabelText('Movement Score').closest('.flex-1')
    );
    
    if (movementSlider) {
      fireEvent.change(movementSlider, { target: { value: '9' } });
    }

    const saveButton = screen.getByText('Save Evaluation');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        scores: expect.objectContaining({
          movement: 9
        })
      }));
    });
  });

  it('handles notes input', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const notesInput = await waitFor(() => screen.getByLabelText('Evaluation Notes'));
    fireEvent.change(notesInput, { target: { value: 'New test notes' } });

    const saveButton = screen.getByText('Save Evaluation');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        notes: 'New test notes'
      }));
    });
  });

  it('validates score ranges', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const movementSlider = await waitFor(() => 
      screen.getByLabelText('Movement Score').closest('.flex-1')
    );
    
    if (movementSlider) {
      fireEvent.change(movementSlider, { target: { value: '11' } });
    }

    const saveButton = screen.getByText('Save Evaluation');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/must be between 0 and 10/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('displays loading state during save', async () => {
    const slowSave = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ id: 'test-eval-123' }), 100))
    );

    render(
      <EvaluationForm
        onSave={slowSave}
        initialData={mockInitialData}
      />
    );

    const saveButton = screen.getByText('Save Evaluation');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  it('handles save errors', async () => {
    const mockError = new Error('Save failed');
    const failedSave = jest.fn().mockRejectedValue(mockError);

    render(
      <EvaluationForm
        onSave={failedSave}
        initialData={mockInitialData}
      />
    );

    const saveButton = screen.getByText('Save Evaluation');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Error saving evaluation. Please try again.')).toBeInTheDocument();
    });
  });

  it('handles offline mode', async () => {
    // Mock offline mode
    jest.spyOn(useOfflineSyncModule, 'useOfflineSync').mockImplementation(() => ({
      isOnline: false,
      isSyncing: false,
      syncQueue: [],
      saveOffline: jest.fn().mockResolvedValue(undefined),
      syncQueuedItems: jest.fn().mockResolvedValue(undefined)
    }));

    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Offline Mode - Changes will sync when online')).toBeInTheDocument();
    });
  });
});