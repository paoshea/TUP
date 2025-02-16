"use client";

import { createElement, type ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: ComponentType<LucideProps>;
}

export function Icon({ icon, ...props }: IconProps) {
  return createElement(icon, {
    ...props,
    'aria-hidden': true
  });
}