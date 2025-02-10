export function RouteError({
  error,
  reset,
  pageName,
}: {
  error: Error;
  reset: () => void;
  pageName: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">Error Loading {pageName}</h1>
        <div className="bg-destructive/10 text-destructive rounded-md p-4">
          {error.message || 'An unexpected error occurred'}
        </div>
        <div className="flex justify-center space-x-4">
          <a 
            href="/" 
            className="inline-flex items-center justify-center rounded-md px-4 h-10 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Go Home
          </a>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md px-4 h-10 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}