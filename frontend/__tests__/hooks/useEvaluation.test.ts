import { renderHook, act } from '@testing-library/react';
import { useEvaluation } from '@/hooks/useEvaluation';
import { api } from '@/services/api';

// Mock the API service
jest.mock('@/services/api', () => ({
  api: {
    animals: {
      get: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
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
    (api.animals.get as jest.Mock).mockResolvedValueOnce(mockAnimal);

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
    expect(api.animals.get).toHaveBeenCalledWith('123');
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

    (api.animals.create as jest.Mock).mockResolvedValueOnce({ ...newAnimal, id: '456' });

    const { result } = renderHook(() => useEvaluation());

    await act(async () => {
      await result.current.saveEvaluation(newAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(api.animals.create).toHaveBeenCalledWith(newAnimal);
  });

  it('handles evaluation saving for existing animal', async () => {
    const updates = {
      notes: 'Updated notes',
    };

    (api.animals.update as jest.Mock).mockResolvedValueOnce({ ...mockAnimal, ...updates });

    const { result } = renderHook(() => useEvaluation('123'));

    await act(async () => {
      await result.current.saveEvaluation(updates);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(api.animals.update).toHaveBeenCalledWith('123', updates);
  });

  it('handles fetch error', async () => {
    const error = new Error('Failed to fetch');
    (api.animals.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEvaluation('123'));

    await act(async () => {
      await result.current.fetchEvaluation();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
    expect(result.current.evaluation).toBeNull();
  });

  it('handles save error', async () => {
    const error = new Error('Failed to save');
    (api.animals.create as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useEvaluation());

    await expect(
      act(async () => {
        await result.current.saveEvaluation({ notes: 'Test' });
      })
    ).rejects.toThrow('Failed to save');

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });
});