import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
  });

  // MongoDB Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: 'A record with this value already exists',
    });
  }

  // MongoDB Cast Error (Invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'The provided ID is not valid',
    });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Authentication token is invalid',
    });
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired',
    });
  }

  // Custom App Error
  if (err.status) {
    return res.status(err.status).json({
      error: err.name,
      message: err.message,
    });
  }

  // Default Error
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};