declare module '@/lib/utils' {
  import { type ClassValue } from 'clsx';
  export function cn(...inputs: ClassValue[]): string;
}

declare module '@/components/ui/*' {
  export * from '../components/ui/*';
}

declare module '@/services/*' {
  export * from '../services/*';
}

declare module '@/hooks/*' {
  export * from '../hooks/*';
}

declare module '@/components/*' {
  export * from '../components/*';
}