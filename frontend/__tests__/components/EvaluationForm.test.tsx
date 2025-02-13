import React from 'react';
import { render, screen, fireEvent } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/features/evaluations/EvaluationForm';

describe('EvaluationForm', () => {
  const mockAnimals = [
    { id: 'test-animal-1', name: 'Test Animal 1' },
    { id: 'test-animal-2', name: 'Test Animal 2' },
  ];

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the evaluation form correctly', () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Check for main form elements
    expect(screen.getByText('Animal')).toBeInTheDocument();
    expect(screen.getByText('Movement')).toBeInTheDocument();
    expect(screen.getByText('Conformation')).toBeInTheDocument();
    expect(screen.getByText('Muscle Development')).toBeInTheDocument();
    expect(screen.getByText('Breed Characteristics')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('handles score inputs correctly', () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Find score inputs
    const movementSlider = screen.getByRole('slider', { name: /Movement/i });
    const conformationSlider = screen.getByRole('slider', { name: /Conformation/i });

    // Change scores
    fireEvent.change(movementSlider, { target: { value: '8' } });
    fireEvent.change(conformationSlider, { target: { value: '9' } });

    // Check if values are updated
    expect(movementSlider).toHaveValue('8');
    expect(conformationSlider).toHaveValue('9');
  });

  it('submits the form with correct data', () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Select animal
    const animalSelect = screen.getByRole('combobox');
    fireEvent.change(animalSelect, { target: { value: 'test-animal-1' } });

    // Change scores
    const movementSlider = screen.getByRole('slider', { name: /Movement/i });
    fireEvent.change(movementSlider, { target: { value: '8' } });

    // Add notes
    const notesTextarea = screen.getByRole('textbox', { name: /Notes/i });
    fireEvent.change(notesTextarea, { target: { value: 'Test evaluation notes' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Save Evaluation/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        animalId: 'test-animal-1',
        scores: expect.objectContaining({
          movement: 8,
        }),
        notes: 'Test evaluation notes',
      })
    );
  });

  it('handles cancel button click', () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});