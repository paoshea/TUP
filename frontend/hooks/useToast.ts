import { useCallback } from 'react';
import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastPromiseOptions<T> {
  loading?: string;
  success?: string | ((data: T) => string);
  error?: string | ((error: Error) => string);
}

export function useToast() {
  const success = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      action: options?.action,
    });
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    toast.warning(message, {
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    toast.info(message, {
      duration: options?.duration || 3000,
      action: options?.action,
    });
  }, []);

  const promise = useCallback(
    <T>(
      promise: Promise<T>,
      {
        loading = 'Loading...',
        success = 'Success!',
        error = 'Something went wrong',
      }: ToastPromiseOptions<T> = {}
    ) => {
      toast.promise(promise, {
        loading,
        success: (data: T) =>
          typeof success === 'function' ? success(data) : success,
        error: (err: Error) =>
          typeof error === 'function' ? error(err) : error,
      });
    },
    []
  );

  const dismiss = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    success,
    error,
    warning,
    info,
    promise,
    dismiss,
  } as const;
}