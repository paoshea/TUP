import { mockStore } from '@/lib/mock/store';

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Error Types
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends APIError {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

// API Client Interface
interface APIClient {
  get<T>(path: string, params?: Record<string, any>): Promise<T>;
  post<T>(path: string, data?: any): Promise<T>;
  put<T>(path: string, data?: any): Promise<T>;
  delete(path: string): Promise<void>;
}

// Mock API Client (using mock store)
class MockAPIClient implements APIClient {
  async get<T>(path: string): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Parse path and return mock data
    if (path.startsWith('/animals')) {
      return mockStore.getAnimals() as unknown as T;
    }
    if (path.startsWith('/shows')) {
      return mockStore.getShows() as unknown as T;
    }
    if (path.startsWith('/evaluations')) {
      return mockStore.getEvaluations() as unknown as T;
    }
    if (path.startsWith('/statistics')) {
      return mockStore.getStatistics() as unknown as T;
    }

    throw new APIError('Not found', 404);
  }

  async post<T>(path: string, data: any): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (path.startsWith('/animals')) {
      return mockStore.addAnimal(data) as unknown as T;
    }
    if (path.startsWith('/shows')) {
      return mockStore.addShow(data) as unknown as T;
    }
    if (path.startsWith('/evaluations')) {
      return mockStore.addEvaluation(data) as unknown as T;
    }

    throw new APIError('Not found', 404);
  }

  async put<T>(path: string, data: any): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const id = path.split('/').pop();
    if (!id) throw new APIError('Invalid ID', 400);

    if (path.startsWith('/animals')) {
      mockStore.updateAnimal(id, data);
      return mockStore.getAnimal(id) as unknown as T;
    }
    if (path.startsWith('/shows')) {
      mockStore.updateShow(id, data);
      return mockStore.getShow(id) as unknown as T;
    }
    if (path.startsWith('/evaluations')) {
      mockStore.updateEvaluation(id, data);
      return mockStore.getEvaluation(id) as unknown as T;
    }

    throw new APIError('Not found', 404);
  }

  async delete(path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const id = path.split('/').pop();
    if (!id) throw new APIError('Invalid ID', 400);

    if (path.startsWith('/animals')) {
      mockStore.deleteAnimal(id);
      return;
    }
    if (path.startsWith('/shows')) {
      mockStore.deleteShow(id);
      return;
    }
    if (path.startsWith('/evaluations')) {
      mockStore.deleteEvaluation(id);
      return;
    }

    throw new APIError('Not found', 404);
  }
}

// Real API Client (to be implemented)
class RealAPIClient implements APIClient {
  async get<T>(_path: string, _params?: Record<string, any>): Promise<T> {
    throw new Error('Real API client not implemented');
  }

  async post<T>(_path: string, _data?: any): Promise<T> {
    throw new Error('Real API client not implemented');
  }

  async put<T>(_path: string, _data?: any): Promise<T> {
    throw new Error('Real API client not implemented');
  }

  async delete(_path: string): Promise<void> {
    throw new Error('Real API client not implemented');
  }
}

// Export API client instance
export const api = process.env.NEXT_PUBLIC_USE_MOCK_API
  ? new MockAPIClient()
  : new RealAPIClient();

// Helper function to handle API errors
export function handleAPIError(error: unknown): never {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new APIError(error.message);
  }

  throw new APIError('An unknown error occurred');
}