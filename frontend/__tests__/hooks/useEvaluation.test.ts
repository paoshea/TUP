import { renderHook, act } from '@testing-library/react';
import { useEvaluation } from '../../hooks/useEvaluation';
import { api } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  api: {
    animals: {
      get: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('useEvaluation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with null evaluation', () => {
    const { result } = renderHook(() => useEvaluation());
    expect(result.current.evaluation).toBeNull();
  });

  it('fetches evaluation when animalId is provided', async () => {
    const mockAnimal = {
      id: '123',
      name: 'Test Animal',
      scores: {
        movement: 8,
        conformation: 7,
        muscleDevelopment: 9,
        breedCharacteristics: 8,
      },
      notes: 'Test notes',
    };

    (api.animals.get as jest.Mock).mockResolvedValueOnce(mockAnimal);

    const { result } = renderHook(() => useEvaluation('123'));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for the fetch to complete
    await act(async () => {
      await result.current.fetchEvaluation();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.evaluation).toEqual(mockAnimal);
    expect(api.animals.get).toHaveBeenCalledWith('123');
  });

  it('handles save evaluation for new animal', async () => {
    const newAnimal = {
      name: 'New Animal',
      scores: {
        movement: 8,
        conformation: 7,
        muscleDevelopment: 9,
        breedCharacteristics: 8,
      },
      notes: 'Test notes',
    };

    const savedAnimal = { ...newAnimal, id: '456' };
    (api.animals.create as jest.Mock).mockResolvedValueOnce(savedAnimal);

    const { result } = renderHook(() => useEvaluation());

    await act(async () => {
      await result.current.saveEvaluation(newAnimal);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.evaluation).toEqual(savedAnimal);
    expect(api.animals.create).toHaveBeenCalledWith(newAnimal);
  });

  it('handles save evaluation for existing animal', async () => {
    const existingAnimal = {
      id: '789',
      name: 'Existing Animal',
      scores: {
        movement: 8,
        conformation: 7,
        muscleDevelopment: 9,
        breedCharacteristics: 8,
      },
      notes: 'Original notes',
    };

    const updates = {
      notes: 'Updated notes',
    };

    const updatedAnimal = { ...existingAnimal, ...updates };
    (api.animals.update as jest.Mock).mockResolvedValueOnce(updatedAnimal);

    const { result } = renderHook(() => useEvaluation('789'));

    await act(async () => {
      await result.current.saveEvaluation(updates);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.evaluation).toEqual(updatedAnimal);
    expect(api.animals.update).toHaveBeenCalledWith('789', updates);
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