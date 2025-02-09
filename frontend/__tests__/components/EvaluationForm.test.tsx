import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/EvaluationForm';
import { mockUsePhotos } from '@/utils/test-utils';

// Mock hooks
jest.mock('@/hooks/usePhotos', () => ({
  usePhotos: () => mockUsePhotos()
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
      expect(screen.getByText('Movement')).toBeInTheDocument();
      expect(screen.getByText('Conformation')).toBeInTheDocument();
      expect(screen.getByText('Muscle Development')).toBeInTheDocument();
      expect(screen.getByText('Breed Characteristics')).toBeInTheDocument();
    });
  });

  it('handles score changes', async () => {
    render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    const movementInput = await waitFor(() => screen.getByLabelText(/movement/i));
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

    const notesInput = await waitFor(() => screen.getByLabelText(/notes/i));
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

    const movementInput = await waitFor(() => screen.getByLabelText(/movement/i));
    fireEvent.change(movementInput, { target: { value: '11' } });

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/must be between 0 and 10/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('shows photo upload interface', async () => {
    const { container } = render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

    await waitFor(() => {
      const uploadButton = screen.getByText(/upload photo/i);
      expect(uploadButton).toBeInTheDocument();

      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  it('handles photo upload', async () => {
    const { container } = render(
      <EvaluationForm
        onSave={mockOnSave}
        initialData={mockInitialData}
      />
    );

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

    const saveButton = await waitFor(() => screen.getByText(/save/i));
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
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

    const saveButton = await waitFor(() => screen.getByText(/save/i));
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });
});