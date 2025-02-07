import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wraps an async request handler to properly catch and forward errors
 * @param fn The async request handler function
 * @returns A function that handles the async operation and catches any errors
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Creates a wrapper for database operations with proper error handling
 * @param operation The database operation to perform
 * @returns A promise that resolves with the operation result or rejects with a handled error
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    // Handle specific database errors
    if (error.name === 'ValidationError') {
      throw new Error(`Validation Error: ${error.message}`);
    }
    if (error.name === 'CastError') {
      throw new Error(`Invalid ID: ${error.value}`);
    }
    if (error.code === 11000) {
      throw new Error('Duplicate entry');
    }
    // Re-throw other errors
    throw error;
  }
};

/**
 * Wraps a database operation in a transaction
 * @param operation The database operation to perform within a transaction
 * @returns A promise that resolves with the operation result
 */
export const withTransaction = async <T>(
  operation: (session: any) => Promise<T>
): Promise<T> => {
  const mongoose = await import('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Retries an operation with exponential backoff
 * @param operation The operation to retry
 * @param maxRetries Maximum number of retry attempts
 * @param baseDelay Base delay in milliseconds
 * @returns A promise that resolves with the operation result
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Only retry on specific errors
      if (!isRetryableError(error)) {
        throw error;
      }
      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};

/**
 * Determines if an error is retryable
 * @param error The error to check
 * @returns boolean indicating if the error is retryable
 */
const isRetryableError = (error: any): boolean => {
  // Add specific error types that should be retried
  return (
    error.name === 'MongoNetworkError' ||
    error.name === 'MongoTimeoutError' ||
    (error.code && [11000, 11001].includes(error.code))
  );
};