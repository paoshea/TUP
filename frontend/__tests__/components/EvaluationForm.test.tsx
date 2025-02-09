import { render, screen, fireEvent } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/EvaluationForm';
import '@testing-library/jest-dom';

describe('EvaluationForm', () => {
  const mockOnSave = jest.fn();
  const mockInitialData = {
    id: '1',
    scores: {
      movement: 5,
      conformation: 5,
      muscleDevelopment: 5,
      breedCharacteristics: 5
    },
    notes: '',
    images: []
  };

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders all score categories', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    // Check for score category labels
    expect(screen.getByText('Movement')).toBeInTheDocument();
    expect(screen.getByText('Conformation')).toBeInTheDocument();
    expect(screen.getByText('Muscle Development')).toBeInTheDocument();
    expect(screen.getByText('Breed Characteristics')).toBeInTheDocument();
  });

  it('handles score changes', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    // Find score inputs
    const movementInput = screen.getByLabelText('Movement') as HTMLInputElement;
    const conformationInput = screen.getByLabelText('Conformation') as HTMLInputElement;

    // Change scores
    fireEvent.change(movementInput, { target: { value: '8' } });
    fireEvent.change(conformationInput, { target: { value: '9' } });

    // Check if values were updated
    expect(movementInput.value).toBe('8');
    expect(conformationInput.value).toBe('9');
  });

  it('handles notes input', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    const notesInput = screen.getByPlaceholderText('Add evaluation notes...') as HTMLTextAreaElement;
    const testNote = 'Excellent muscle definition and movement';

    fireEvent.change(notesInput, { target: { value: testNote } });
    expect(notesInput.value).toBe(testNote);
  });

  it('handles form submission', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    // Fill out form
    const movementInput = screen.getByLabelText('Movement') as HTMLInputElement;
    const notesInput = screen.getByPlaceholderText('Add evaluation notes...') as HTMLTextAreaElement;

    fireEvent.change(movementInput, { target: { value: '8' } });
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });

    // Submit form
    const submitButton = screen.getByText('Save Evaluation');
    fireEvent.click(submitButton);

    // Check if onSave was called with correct data
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        scores: expect.objectContaining({
          movement: 8,
        }),
        notes: 'Test notes',
      })
    );
  });

  it('validates score ranges', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    const movementInput = screen.getByLabelText('Movement') as HTMLInputElement;

    // Test score above max
    fireEvent.change(movementInput, { target: { value: '11' } });
    expect(movementInput.value).toBe('10'); // Should be clamped to max

    // Test score below min
    fireEvent.change(movementInput, { target: { value: '-1' } });
    expect(movementInput.value).toBe('0'); // Should be clamped to min
  });

  it('shows photo upload interface', () => {
    render(<EvaluationForm 
      onSave={mockOnSave}
      initialData={mockInitialData}
    />);
    
    expect(screen.getByText('Add Photos')).toBeInTheDocument();
  });
});