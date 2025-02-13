import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${className} ${variant === 'outline' ? 'border border-gray-300' : 'bg-primary'}`}
      {...props}
    />
  );
}