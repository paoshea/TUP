import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validationError } from './apiResponse';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Add validated data to request
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err: z.ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(validationError(details));
      } else {
        next(error);
      }
    }
  };
};

// Common validation schemas
export const paginationSchema = {
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
};

export const idSchema = {
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID'),
};

// Configure custom error messages
z.setErrorMap((issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case 'invalid_type':
      message = `Expected ${issue.expected}, received ${issue.received}`;
      break;
    case 'custom':
      message = issue.message || 'Invalid value';
      break;
    case 'invalid_string':
      if (issue.validation === 'regex') message = 'Invalid format';
      else if (issue.validation === 'email') message = 'Invalid email address';
      else message = `Invalid string - ${issue.validation}`;
      break;
    case 'too_small':
      message = `Must be greater than or equal to ${issue.minimum}`;
      break;
    case 'too_big':
      message = `Must be less than or equal to ${issue.maximum}`;
      break;
    case 'invalid_enum_value':
      message = `Invalid value. Expected one of: ${issue.options.join(', ')}`;
      break;
    default:
      message = issue.message || 'Invalid value';
  }
  return { message };
});