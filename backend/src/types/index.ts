import { Request } from 'express';
import { Types } from 'mongoose';

// Auth types
export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
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

// Sync types
export type SyncOperation = 'insert' | 'update' | 'delete';
export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';
export type ConflictResolution = 'client_wins' | 'server_wins' | 'manual';

// Push notification types
export type NotificationType = 'evaluation' | 'show' | 'sync' | 'system';
export type NotificationStatus = 'pending' | 'sent' | 'failed';
export type Platform = 'ios' | 'android' | 'web';

// Utility types
export type MongoId = Types.ObjectId | string;

// Generic types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type WithId<T> = T & { _id: Types.ObjectId };
export type WithTimestamps<T> = T & {
  created_at: Date;
  updated_at?: Date;
};

// Error types
export interface AppError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

// Query types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryOptions extends PaginationOptions {
  filters?: FilterOptions;
  populate?: string[];
  select?: string[];
}

// Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Service types
export interface ServiceOptions {
  session?: any;
  user?: {
    id: string;
    email: string;
  };
}