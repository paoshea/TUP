"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-lg font-semibold mb-4">Something went wrong!</h2>
        <div className="bg-destructive/10 text-destructive rounded-md p-4 mb-4">
          {error.message || 'An unexpected error occurred'}
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md px-4 h-10 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}