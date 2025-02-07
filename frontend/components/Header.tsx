"use client";

import React from 'react';
import { Menu, User } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-blue-700 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <Logo width={80} height={40} className="transition-transform hover:scale-105" />
              <h1 className="text-xl font-bold">LiveStock Show Assistant</h1>
            </div>
          </div>
          <button className="p-1 hover:bg-blue-700 rounded-lg">
            <User size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}