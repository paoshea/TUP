import { api, APIError } from './api';

export interface BaseEntity {
  id: string;
  [key: string]: any;
}

export class BaseService<T extends BaseEntity> {
  constructor(protected basePath: string) {}

  async getAll(): Promise<T[]> {
    try {
      return await api.get<T[]>(this.basePath);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<T> {
    try {
      return await api.get<T>(`${this.basePath}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      return await api.post<T>(this.basePath, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await api.put<T>(`${this.basePath}/${id}`, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new APIError(error.message);
    }
    throw new APIError('An unknown error occurred');
  }
}