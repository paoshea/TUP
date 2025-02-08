"use client";

import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Demo System - Future State Preview
        </h1>
        
        <p className="text-muted-foreground mb-8">
          This demo showcases the future state of the TUP Livestock Management System
          using comprehensive mock data to demonstrate the full functionality.
        </p>

        <Dashboard />
      </main>
    </div>
  );
}
