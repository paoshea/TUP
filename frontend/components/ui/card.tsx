import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`border-b p-4 ${className}`} {...props} />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className = '', ...props }: CardTitleProps) {
  return (
    <h2 className={`text-lg font-medium ${className}`} {...props} />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className = '', ...props }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`} {...props} />
  );
}
