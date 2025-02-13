import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/features/evaluations';
import * as useOfflineSyncModule from '@/hooks/useOfflineSync';

// Mock the useOfflineSync hook
jest.mock('@/hooks/useOfflineSync', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('EvaluationForm', () => {
  const mockAnimals = [
    {
      id: 'test-animal-1',
      name: 'Test Animal',
    }
  ];

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useOfflineSyncModule.default as jest.Mock).mockReturnValue({
      isOnline: true,
      syncStatus: 'synced',
    });
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
    expect(screen.getByText(/Movement/i)).toBeInTheDocument();
    expect(screen.getByText(/Conformation/i)).toBeInTheDocument();
    expect(screen.getByText(/Muscle Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Breed Characteristics/i)).toBeInTheDocument();
  });

  it('handles score inputs correctly', async () => {
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

  it('submits the form with correct data', async () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Select animal
    const animalSelect = screen.getByRole('combobox');
    fireEvent.change(animalSelect, { target: { value: mockAnimals[0].id } });

    // Change scores
    const movementSlider = screen.getByRole('slider', { name: /Movement/i });
    fireEvent.change(movementSlider, { target: { value: '8' } });

    // Add notes
    const notesTextarea = screen.getByRole('textbox', { name: /Notes/i });
    fireEvent.change(notesTextarea, { target: { value: 'Test evaluation notes' } });

    // Submit form
    fireEvent.click(screen.getByText(/Save Evaluation/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          animalId: mockAnimals[0].id,
          scores: expect.objectContaining({
            movement: 8,
          }),
          notes: 'Test evaluation notes',
        })
      );
    });
  });

  it('validates required fields', async () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Try to submit without selecting an animal
    fireEvent.click(screen.getByText(/Save Evaluation/i));

    // Check for validation message
    expect(screen.getByRole('combobox')).toBeInvalid();
  });

  it('handles cancel button click', () => {
    render(
      <EvaluationForm
        animals={mockAnimals}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});