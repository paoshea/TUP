"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = mockStore.getCurrentUser();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/signin');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
          <p className="text-gray-600 mt-2">
            Manage your livestock, track evaluations, and monitor performance all in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Animals</h3>
            <p className="text-2xl font-semibold mt-2">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Shows</h3>
            <p className="text-2xl font-semibold mt-2">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Evaluations</h3>
            <p className="text-2xl font-semibold mt-2">0</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Recent Activities</h3>
            <p className="text-2xl font-semibold mt-2">0</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-center py-8">
            No recent activity to display
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Add New Animal</h3>
            <p className="text-gray-600 text-sm mb-4">
              Register a new animal in your livestock inventory.
            </p>
            <button className="text-primary hover:text-primary/90">
              Add Animal →
            </button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Create Evaluation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Start a new evaluation for your livestock.
            </p>
            <button className="text-primary hover:text-primary/90">
              New Evaluation →
            </button>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Register for Show</h3>
            <p className="text-gray-600 text-sm mb-4">
              Register your animals for upcoming shows.
            </p>
            <button className="text-primary hover:text-primary/90">
              View Shows →
            </button>
          </Card>
        </div>

        {/* Upcoming Shows */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Shows</h2>
          <div className="text-gray-500 text-center py-8">
            No upcoming shows scheduled
          </div>
        </Card>
      </div>
    </div>
  );
}