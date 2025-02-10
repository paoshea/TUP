import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { EvaluationForm } from '@/components/features/evaluations';
import { FlockAnalyzer } from '@/components/features/animals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';

describe('Evaluation Integration', () => {
  const mockAnimal = {
    id: 'test-animal-1',
    name: 'Test Animal',
    breed: 'Test Breed',
    status: 'Active',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.getAnimal.mockReturnValue(mockAnimal);
  });

  it('completes an evaluation flow', async () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Evaluation</CardTitle>
          <CardDescription>Complete evaluation for {mockAnimal.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <EvaluationForm
            animalId={mockAnimal.id}
            onComplete={jest.fn()}
          />
        </CardContent>
      </Card>
    );

    // Fill in evaluation form
    fireEvent.change(screen.getByLabelText(/Movement/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/Conformation/i), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText(/Muscle Development/i), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText(/Breed Characteristics/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'Test evaluation notes' },
    });

    // Submit evaluation
    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(mockStore.saveEvaluation).toHaveBeenCalledWith(
        expect.objectContaining({
          animalId: mockAnimal.id,
          scores: {
            movement: 8,
            conformation: 7,
            muscleDevelopment: 9,
            breedCharacteristics: 8,
          },
          notes: 'Test evaluation notes',
        })
      );
    });
  });

  it('analyzes flock data after evaluation', async () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Flock Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <FlockAnalyzer animals={[mockAnimal]} />
        </CardContent>
      </Card>
    );

    // Check if analysis is displayed
    await waitFor(() => {
      expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Average Score/i)).toBeInTheDocument();
    });

    // Verify scores are analyzed
    const scores = Object.values(mockAnimal.scores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    expect(screen.getByText(new RegExp(average.toFixed(1)))).toBeInTheDocument();
  });

  it('handles offline state gracefully', async () => {
    // Mock offline state
    mockStore.isOnline.mockReturnValue(false);

    render(
      <Card>
        <CardContent>
          <EvaluationForm
            animalId={mockAnimal.id}
            onComplete={jest.fn()}
          />
        </CardContent>
      </Card>
    );

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/Movement/i), { target: { value: '8' } });
    fireEvent.click(screen.getByText(/Submit/i));

    // Verify offline handling
    await waitFor(() => {
      expect(screen.getByText(/Saved offline/i)).toBeInTheDocument();
      expect(mockStore.queueSync).toHaveBeenCalled();
    });
  });
});