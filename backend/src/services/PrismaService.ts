import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiResponse';
import { WhereInput } from '../types/prisma';

export type PaginationOptions = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export type FilterOptions = {
  [key: string]: WhereInput | any;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export class PrismaService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  /**
   * Handle common database errors
   */
  protected handleError(error: any): never {
    if (error.code === 'P2002') {
      throw new ApiError(409, 'DUPLICATE_ENTRY', 'Duplicate entry found');
    }

    if (error.code === 'P2025') {
      throw new ApiError(404, 'NOT_FOUND', 'Record not found');
    }

    if (error.code === 'P2023') {
      throw new ApiError(400, 'INVALID_ID', 'Invalid ID format');
    }

    if (error.code === 'P2003') {
      throw new ApiError(400, 'FOREIGN_KEY_VIOLATION', 'Referenced record does not exist');
    }

    throw error;
  }

  /**
   * Helper method to handle pagination
   */
  protected getPaginationParams(options: PaginationOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
    };
  }

  /**
   * Helper method to handle sorting
   */
  protected getSortParams(options: PaginationOptions = {}) {
    const sort = options.sort || 'createdAt';
    const order = options.order || 'desc';

    return {
      orderBy: {
        [sort]: order,
      },
    };
  }

  /**
   * Helper method to create paginated response
   */
  protected createPaginatedResponse<T>(
    items: T[],
    total: number,
    { page, limit }: { page: number; limit: number }
  ): PaginatedResponse<T> {
    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Helper method to convert WhereInput to Prisma where clause
   */
  protected convertWhereInput(where: WhereInput): any {
    const result: any = {};

    for (const [key, value] of Object.entries(where)) {
      if (typeof value === 'object' && value !== null) {
        const conditions: any = {};
        
        for (const [op, val] of Object.entries(value)) {
          switch (op) {
            case 'equals':
              conditions.equals = val;
              break;
            case 'not':
              conditions.not = val;
              break;
            case 'in':
              conditions.in = val;
              break;
            case 'notIn':
              conditions.notIn = val;
              break;
            case 'lt':
              conditions.lt = val;
              break;
            case 'lte':
              conditions.lte = val;
              break;
            case 'gt':
              conditions.gt = val;
              break;
            case 'gte':
              conditions.gte = val;
              break;
            case 'contains':
              conditions.contains = val;
              break;
            case 'startsWith':
              conditions.startsWith = val;
              break;
            case 'endsWith':
              conditions.endsWith = val;
              break;
          }
        }

        result[key] = conditions;
      } else {
        result[key] = { equals: value };
      }
    }

    return result;
  }
}