import { renderHook, act } from '@testing-library/react';
import { useEvaluation } from '@/hooks/useEvaluation';

// Create mock API functions
const mockApiService = {
  animals: {
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
  }
};

// Mock the API service before importing the hook
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: mockApiService
}));

describe('useEvaluation', () => {
  const mockAnimal = {
    id: '123',
    name: 'Test Animal',
    category: 'Sheep',
    breed: 'Suffolk',
    region: 'Highland',
    scores: {
      movement: 8,
      conformation: 7,
      muscleDevelopment: 9,
      breedCharacteristics: 8,
    },
    notes: 'Test notes',
    images: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with null evaluation', () => {
    const { result } = renderHook(() => useEvaluation());
    expect(result.current.evaluation).toBeNull();
  });

  it('handles evaluation fetching', async () => {
    mockApiService.animals.get.mockResolvedValueOnce(mockAnimal);

    const { result } = renderHook(() => useEvaluation('123'));

    // Initial state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Fetch evaluation
    await act(async () => {
      await result.current.fetchEvaluation();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.evaluation).toEqual(mockAnimal);
    expect(mockApiService.animals.get).toHaveBeenCalledWith('123');
  });

  it('handles evaluation saving for new animal', async () => {
    const newAnimal = {
      name: 'New Animal',
      category: 'Sheep',
      breed: 'Suffolk',
      region: 'Highland',
      scores: {
        movement: 8,
        conformation: 7,
        muscleDevelopment: 9,
        breedCharacteristics: 8,
      },
      notes: 'Test notes',
      images: [],
    };

    mockApiService.animals.create.mockResolvedValueOnce({ ...newAnimal, id: '456' });

    const { result } = renderHook(() => useEvaluation());

    await act(async () => {
      await result.current.saveEvaluation(newAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockApiService.animals.create).toHaveBeenCalledWith(newAnimal);
  });

  it('handles evaluation saving for existing animal', async () => {
    const updates = {
      notes: 'Updated notes',
    };

    mockApiService.animals.update.mockResolvedValueOnce({ ...mockAnimal, ...updates });

    const { result } = renderHook(() => useEvaluation('123'));

    await act(async () => {
      await result.current.saveEvaluation(updates);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockApiService.animals.update).toHaveBeenCalledWith('123', updates);
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch');
    mockApiService.animals.get.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEvaluation('123'));

    await act(async () => {
      try {
        await result.current.fetchEvaluation();
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.evaluation).toBeNull();
  });

  it('handles save error', async () => {
    const error = new Error('Failed to save');
    mockApiService.animals.create.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEvaluation());

    await act(async () => {
      try {
        await result.current.saveEvaluation({ notes: 'Test' });
        fail('Expected save to fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });
});