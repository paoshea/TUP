import { renderHook, act } from '@testing-library/react';
import { useEvaluation } from '@/hooks/useEvaluation';

// Create mock API functions
const mockGet = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockList = jest.fn();

// Mock the API service
jest.mock('@/services/api', () => ({
  api: {
    animals: {
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      list: mockList
    }
  }
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
    mockGet.mockResolvedValueOnce(mockAnimal);

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
    expect(mockGet).toHaveBeenCalledWith('123');
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

    mockCreate.mockResolvedValueOnce({ ...newAnimal, id: '456' });

    const { result } = renderHook(() => useEvaluation());

    await act(async () => {
      await result.current.saveEvaluation(newAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockCreate).toHaveBeenCalledWith(newAnimal);
  });

  it('handles evaluation saving for existing animal', async () => {
    const updates = {
      notes: 'Updated notes',
    };

    mockUpdate.mockResolvedValueOnce({ ...mockAnimal, ...updates });

    const { result } = renderHook(() => useEvaluation('123'));

    await act(async () => {
      await result.current.saveEvaluation(updates);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockUpdate).toHaveBeenCalledWith('123', updates);
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch');
    mockGet.mockRejectedValueOnce(error);

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
    mockCreate.mockRejectedValueOnce(error);

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
