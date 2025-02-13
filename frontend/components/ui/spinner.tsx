import React from 'react';

export function Spinner({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ${className}`}
      {...props}
    />
  );
}