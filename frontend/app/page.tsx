'use client';

import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          TUP Livestock Management System
        </h1>

        <p className="text-muted-foreground mb-8">
          A comprehensive livestock management system for show animals with advanced evaluation tools
          and data-driven insights.
        </p>

        <Dashboard />
      </main>
    </div>
  );
}
