"use client";

import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 100, height = 50 }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
    >
      {/* Background shape */}
      <rect x="50" y="40" width="300" height="120" rx="20" fill="#2563eb"/>
      
      {/* Letters with modern geometric style */}
      {/* T */}
      <path d="M100 70 L160 70 M130 70 L130 130" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      
      {/* U */}
      <path 
        d="M180 70 L180 110 Q180 130 200 130 Q220 130 220 110 L220 70" 
        stroke="white" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* P */}
      <path 
        d="M240 130 L240 70 L280 70 Q300 70 300 85 Q300 100 280 100 L240 100" 
        stroke="white" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Decorative dots */}
      <circle cx="90" cy="150" r="4" fill="white"/>
      <circle cx="310" cy="50" r="4" fill="white"/>
      <circle cx="200" cy="160" r="4" fill="white"/>
    </svg>
  );
}