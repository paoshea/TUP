import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiResponse';

export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  protected handleError(error: unknown): never {
    console.error('Database error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, 'DATABASE_ERROR', 'An unexpected database error occurred');
  }
}