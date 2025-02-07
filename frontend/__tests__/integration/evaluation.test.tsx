import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { EvaluationForm } from '@/components/EvaluationForm';
import '@testing-library/jest-dom';

describe('Evaluation Flow', () => {
  it('completes full evaluation process', async () => {
    render(
      <>
        <FlockAnalyzer />
        <EvaluationForm onSave={jest.fn()} />
      </>
    );

    // Select a flock
    fireEvent.click(screen.getByText("Queen Mother's Caithness Flock"));

    // Fill evaluation form
    const movementInput = screen.getByLabelText('Movement');
    fireEvent.change(movementInput, { target: { value: '8' } });

    const conformationInput = screen.getByLabelText('Conformation');
    fireEvent.change(conformationInput, { target: { value: '9' } });

    const muscleDevelopmentInput = screen.getByLabelText('Muscle Development');
    fireEvent.change(muscleDevelopmentInput, { target: { value: '7' } });

    const breedCharacteristicsInput = screen.getByLabelText('Breed Characteristics');
    fireEvent.change(breedCharacteristicsInput, { target: { value: '8' } });

    const notesInput = screen.getByPlaceholderText('Add evaluation notes...');
    fireEvent.change(notesInput, { target: { value: 'Excellent specimen with strong conformation' } });

    // Submit evaluation
    fireEvent.click(screen.getByText('Save Evaluation'));

    await waitFor(() => {
      expect(screen.getByText('Evaluation saved successfully')).toBeInTheDocument();
    });

    // Verify analysis is shown
    await waitFor(() => {
      expect(screen.getByText('Analysis')).toBeInTheDocument();
      expect(screen.getByText(/Conformation Score:/)).toBeInTheDocument();
      expect(screen.getByText(/Movement Score:/)).toBeInTheDocument();
    });
  });

  it('handles validation and error states', async () => {
    render(
      <>
        <FlockAnalyzer />
        <EvaluationForm onSave={jest.fn()} />
      </>
    );

    // Try to submit without selecting a flock
    fireEvent.click(screen.getByText('Save Evaluation'));
    expect(screen.getByText('Please select a flock first')).toBeInTheDocument();

    // Select a flock but submit invalid scores
    fireEvent.click(screen.getByText("Queen Mother's Caithness Flock"));
    const movementInput = screen.getByLabelText('Movement');
    fireEvent.change(movementInput, { target: { value: '11' } }); // Invalid score

    fireEvent.click(screen.getByText('Save Evaluation'));
    expect(screen.getByText('Invalid score range')).toBeInTheDocument();
  });

  it('integrates with photo upload', async () => {
    render(
      <>
        <FlockAnalyzer />
        <EvaluationForm onSave={jest.fn()} />
      </>
    );

    // Select a flock
    fireEvent.click(screen.getByText("Queen Mother's Caithness Flock"));

    // Verify photo upload section is present
    expect(screen.getByText('Add Photos')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop photos here')).toBeInTheDocument();

    // Mock file upload
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload photos');
    
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });
});