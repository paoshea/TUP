import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  status: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return res.status(status).json(response);
};

export const sendError = (
  res: Response,
  error: Error | ApiError,
  status: number = 500
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: error instanceof ApiError ? error.code : 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error instanceof ApiError ? error.details : undefined,
    },
  };
  return res.status(error instanceof ApiError ? error.status : status).json(response);
};

export const createError = (
  status: number,
  code: string,
  message: string,
  details?: any
): ApiError => {
  return new ApiError(status, code, message, details);
};

// Common error creators
export const notFound = (resource: string, id?: string): ApiError => {
  const message = id
    ? `${resource} with ID ${id} not found`
    : `${resource} not found`;
  return createError(404, 'NOT_FOUND', message);
};

export const badRequest = (message: string, details?: any): ApiError => {
  return createError(400, 'BAD_REQUEST', message, details);
};

export const unauthorized = (message: string = 'Unauthorized'): ApiError => {
  return createError(401, 'UNAUTHORIZED', message);
};

export const forbidden = (message: string = 'Forbidden'): ApiError => {
  return createError(403, 'FORBIDDEN', message);
};

export const conflict = (message: string, details?: any): ApiError => {
  return createError(409, 'CONFLICT', message, details);
};

export const validationError = (details: any): ApiError => {
  return createError(400, 'VALIDATION_ERROR', 'Validation failed', details);
};