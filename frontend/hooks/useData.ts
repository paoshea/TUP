import { useState, useEffect, useCallback } from 'react';
import { APIError } from '@/services/api';
import { BaseEntity } from '@/services/base';
import { withErrorBoundary } from '@/components/ErrorBoundary';

interface UseDataOptions<T> {
  onError?: (error: APIError) => void;
  onSuccess?: (data: T) => void;
}

interface UseDataResult<T> {
  data: T | null;
  error: APIError | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

// Hook for fetching a single item
export function useItem<T extends BaseEntity>(
  fetchFn: () => Promise<T>,
  options: UseDataOptions<T> = {}
): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = err instanceof APIError ? err : new APIError('Failed to fetch data');
      setError(apiError);
      options.onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch: fetch,
  };
}

// Hook for fetching a list of items
export function useList<T extends BaseEntity>(
  fetchFn: () => Promise<T[]>,
  options: UseDataOptions<T[]> = {}
): UseDataResult<T[]> {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = err instanceof APIError ? err : new APIError('Failed to fetch data');
      setError(apiError);
      options.onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch: fetch,
  };
}

// Hook for mutations (create, update, delete)
interface UseMutationOptions<T, R> {
  onError?: (error: APIError) => void;
  onSuccess?: (data: R) => void;
  onSettled?: () => void;
}

interface UseMutationResult<T, R> {
  mutate: (data: T) => Promise<void>;
  error: APIError | null;
  isLoading: boolean;
  isError: boolean;
}

export function useMutation<T, R>(
  mutationFn: (data: T) => Promise<R>,
  options: UseMutationOptions<T, R> = {}
): UseMutationResult<T, R> {
  const [error, setError] = useState<APIError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (data: T) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await mutationFn(data);
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = err instanceof APIError ? err : new APIError('Mutation failed');
      setError(apiError);
      options.onError?.(apiError);
    } finally {
      setIsLoading(false);
      options.onSettled?.();
    }
  }, [mutationFn, options]);

  return {
    mutate,
    error,
    isLoading,
    isError: error !== null,
  };
}

// Entity-specific hooks
export function withDataError<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return withErrorBoundary(WrappedComponent);
}