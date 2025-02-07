import type { Animal, EvaluationCriteria } from '@/types';

export const api = {
  animals: {
    list: async () => {
      const response = await fetch('/api/animals');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch animals');
      }
      return response.json();
    },

    get: async (id: string) => {
      const response = await fetch(`/api/animals?id=${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch animal');
      }
      return response.json();
    },

    create: async (animal: Omit<Animal, 'id'>) => {
      const response = await fetch('/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animal),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create animal');
      }
      return response.json();
    },

    update: async (id: string, updates: Partial<Animal>) => {
      const response = await fetch(`/api/animals?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update animal');
      }
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`/api/animals?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete animal');
      }
    },
  },

  evaluations: {
    getCriteria: async (): Promise<EvaluationCriteria[]> => {
      const response = await fetch('/api/evaluations/criteria');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch evaluation criteria');
      }
      return response.json();
    },

    saveCriteria: async (criteria: EvaluationCriteria) => {
      const response = await fetch('/api/evaluations/criteria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save evaluation criteria');
      }
      return response.json();
    },
  },
};