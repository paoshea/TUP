import { Request } from 'express';

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Pagination types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Query types
export interface QueryOptions extends PaginationOptions {
  filters?: FilterOptions;
  populate?: string[];
  select?: string[];
}

// Service types
export interface ServiceOptions {
  session?: any;
  user?: AuthUser;
}

// File types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}