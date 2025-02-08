"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number;
  height?: number;
  href?: string;
  asLink?: boolean;
}

export function Logo({ 
  className,
  width = 100, 
  height = 50,
  href = '/',
  asLink = true,
  ...props 
}: LogoProps) {
  const svg = (
    <svg 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'transition-transform hover:scale-105',
        className
      )}
      width={width}
      height={height}
      {...props}
    >
      {/* Background shape */}
      <rect 
        x="50" 
        y="40" 
        width="300" 
        height="120" 
        rx="20" 
        className="fill-primary"
      />
      
      {/* Letters with modern geometric style */}
      {/* T */}
      <path 
        d="M100 70 L160 70 M130 70 L130 130" 
        className="stroke-primary-foreground" 
        strokeWidth="12" 
        strokeLinecap="round"
      />
      
      {/* U */}
      <path 
        d="M180 70 L180 110 Q180 130 200 130 Q220 130 220 110 L220 70" 
        className="stroke-primary-foreground" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* P */}
      <path 
        d="M240 130 L240 70 L280 70 Q300 70 300 85 Q300 100 280 100 L240 100" 
        className="stroke-primary-foreground" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Decorative dots */}
      <circle 
        cx="90" 
        cy="150" 
        r="4" 
        className="fill-primary-foreground"
      />
      <circle 
        cx="310" 
        cy="50" 
        r="4" 
        className="fill-primary-foreground"
      />
      <circle 
        cx="200" 
        cy="160" 
        r="4" 
        className="fill-primary-foreground"
      />
    </svg>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-block">
        {svg}
      </Link>
    );
  }

  return svg;
}