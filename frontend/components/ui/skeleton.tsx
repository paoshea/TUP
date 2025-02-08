import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string | number;
}

function SkeletonList({
  count = 3,
  height = '1rem',
  className,
  ...props
}: SkeletonListProps) {
  return (
    <div className="space-y-3" {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('w-full', className)}
          style={{ height }}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageHeight?: string | number;
}

function SkeletonCard({
  imageHeight = '200px',
  className,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 shadow-sm',
        className
      )}
      {...props}
    >
      <Skeleton
        className="mb-4 w-full"
        style={{ height: imageHeight }}
      />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rowCount?: number;
  columnCount?: number;
}

function SkeletonTable({
  rowCount = 5,
  columnCount = 4,
  className,
  ...props
}: SkeletonTableProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="mb-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
        {Array.from({ length: columnCount }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div
            key={i}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {Array.from({ length: columnCount }).map((_, j) => (
              <Skeleton key={j} className="h-6" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton, SkeletonList, SkeletonCard, SkeletonTable };