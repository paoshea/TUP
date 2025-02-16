import { JSX } from 'react';

interface DemoContentProps {
  children: JSX.Element;
  isActive: boolean;
}

export function DemoContent({ children, isActive }: DemoContentProps) {
  if (!isActive) return null;
  return <div className="animate-fade-in">{children}</div>;
}