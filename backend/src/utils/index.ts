export * from './apiResponse';
export * from './asyncHandler';
export * from './cache';
export * from './database';
export * from './dateTime';
export * from './storage';
export * from './validation';

// Re-export commonly used types
export type { ApiResponse, AppError } from '../types';

// Export commonly used constants and configurations
export const UPLOAD_DIR = 'uploads';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Export commonly used error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be authenticated to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: (resource: string) => `${resource} not found`,
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'An unexpected error occurred',
  DUPLICATE_ENTRY: 'A record with this value already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid or expired token',
  FILE_TOO_LARGE: (maxSize: number) => 
    `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: (allowedTypes: string[]) => 
    `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
} as const;

// Export commonly used regex patterns
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  PHONE: /^\+?[\d\s-]{10,}$/,
  MONGO_ID: /^[0-9a-fA-F]{24}$/,
} as const;

// Export commonly used validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) => 
    `${field} must be at least ${min} characters long`,
  MAX_LENGTH: (field: string, max: number) => 
    `${field} must not exceed ${max} characters`,
  MIN_VALUE: (field: string, min: number) => 
    `${field} must be greater than or equal to ${min}`,
  MAX_VALUE: (field: string, max: number) => 
    `${field} must be less than or equal to ${max}`,
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PASSWORD: 
    'Password must be at least 8 characters long and contain at least one letter and one number',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date format',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
} as const;