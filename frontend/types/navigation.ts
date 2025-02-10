import { LucideProps } from 'lucide-react';
import { ComponentType } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<LucideProps>;
}