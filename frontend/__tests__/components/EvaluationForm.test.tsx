import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EvaluationForm } from '@/components/EvaluationForm';
import { mockUsePhotos } from '@/utils/test-utils';

// Mock hooks
jest.mock('@/hooks/usePhotos', () => ({
  usePhotos: () => mockUsePhotos()
}));

describe('EvaluationForm', () => {
  const mockOnSave = jest.fn();
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

  it('renders all score categories', () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    expect(screen.getByText('Movement')).toBeInTheDocument();
    expect(screen.getByText('Conformation')).toBeInTheDocument();
    expect(screen.getByText('Muscle Development')).toBeInTheDocument();
    expect(screen.getByText('Breed Characteristics')).toBeInTheDocument();
  });

  it('handles score changes', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const movementInput = screen.getByLabelText(/movement/i);
    fireEvent.change(movementInput, { target: { value: '9' } });

    const saveButton = screen.getByText(/save/i);
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

    const notesInput = screen.getByLabelText(/notes/i);
    fireEvent.change(notesInput, { target: { value: 'New test notes' } });

    const saveButton = screen.getByText(/save/i);
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

    const movementInput = screen.getByLabelText(/movement/i);
    fireEvent.change(movementInput, { target: { value: '11' } });

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/must be between 0 and 10/i)).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows photo upload interface', async () => {
    const { container } = render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const uploadButton = screen.getByText(/upload photo/i);
    expect(uploadButton).toBeInTheDocument();

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('handles photo upload', async () => {
    const { container } = render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

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

  it('displays loading state during save', async () => {
    render(
      <EvaluationForm
        onSave={async () => new Promise(resolve => setTimeout(resolve, 100))}
        initialData={mockInitialData}
      />
    );

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/saving/i)).toBeInTheDocument();
  });

  it('handles save errors', async () => {
    const mockError = new Error('Save failed');
    render(
      <EvaluationForm
        onSave={() => Promise.reject(mockError)}
        initialData={mockInitialData}
      />
    );

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    expect(await screen.findByText(/failed to save/i)).toBeInTheDocument();
  });
});