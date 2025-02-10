import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/features/evaluations';
import * as useOfflineSyncModule from '@/hooks/useOfflineSync';
import { mockStore } from '@/lib/mock/store';

// Mock the useOfflineSync hook
jest.mock('@/hooks/useOfflineSync', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('EvaluationForm', () => {
  const mockAnimal = {
    id: 'test-animal-1',
    name: 'Test Animal',
    breed: 'Test Breed',
    status: 'Active',
  };

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useOfflineSyncModule.default as jest.Mock).mockReturnValue({
      isOnline: true,
      syncStatus: 'synced',
    });
  });

  it('renders the evaluation form correctly', () => {
    render(<EvaluationForm animalId={mockAnimal.id} onComplete={mockOnComplete} />);

    // Check for main form elements
    expect(screen.getByText(/Movement/i)).toBeInTheDocument();
    expect(screen.getByText(/Conformation/i)).toBeInTheDocument();
    expect(screen.getByText(/Muscle Development/i)).toBeInTheDocument();
    expect(screen.getByText(/Breed Characteristics/i)).toBeInTheDocument();
  });

  it('handles score inputs correctly', async () => {
    render(<EvaluationForm animalId={mockAnimal.id} onComplete={mockOnComplete} />);

    // Find score inputs
    const movementInput = screen.getByLabelText(/Movement/i);
    const conformationInput = screen.getByLabelText(/Conformation/i);

    // Change scores
    fireEvent.change(movementInput, { target: { value: '8' } });
    fireEvent.change(conformationInput, { target: { value: '9' } });

    // Check if values are updated
    expect(movementInput).toHaveValue(8);
    expect(conformationInput).toHaveValue(9);
  });

  it('submits the form with correct data', async () => {
    const mockSubmit = jest.spyOn(mockStore, 'saveEvaluation');
    render(<EvaluationForm animalId={mockAnimal.id} onComplete={mockOnComplete} />);

    // Fill in form
    fireEvent.change(screen.getByLabelText(/Movement/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/Conformation/i), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'Test evaluation notes' },
    });

    // Submit form
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          animalId: mockAnimal.id,
          scores: expect.objectContaining({
            movement: 8,
            conformation: 9,
          }),
          notes: 'Test evaluation notes',
        })
      );
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(<EvaluationForm animalId={mockAnimal.id} onComplete={mockOnComplete} />);

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/All scores are required/i)).toBeInTheDocument();
    });
  });

  it('handles offline state correctly', () => {
    (useOfflineSyncModule.default as jest.Mock).mockReturnValue({
      isOnline: false,
      syncStatus: 'pending',
    });

    render(<EvaluationForm animalId={mockAnimal.id} onComplete={mockOnComplete} />);

    expect(screen.getByText(/Working Offline/i)).toBeInTheDocument();
  });
});