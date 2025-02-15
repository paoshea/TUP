import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'default', size = 'md', className = '', ...props }, ref) => {
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <button
      className={`${className} ${variant === 'outline' ? 'border border-gray-300' : 'bg-primary'} ${sizeClasses[size]}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';
