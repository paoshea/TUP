"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/context/AuthContext';

function SettingsClient() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    showReminders: true,
  });
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAppearanceChange = (key: keyof typeof appearance) => {
    setAppearance(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
        <div className="grid gap-6 max-w-xl">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={user?.name}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              defaultValue={user?.email}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="farm">Farm</Label>
            <Input
              id="farm"
              defaultValue={user?.farm}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              defaultValue={user?.location}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              defaultValue={user?.role}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="memberSince">Member Since</Label>
            <Input
              id="memberSince"
              defaultValue={user?.memberSince}
              disabled
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Notifications Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Notifications & Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => handleNotificationChange('email')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive mobile notifications</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={() => handleNotificationChange('push')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Reminders</p>
              <p className="text-sm text-gray-600">Get show preparation reminders</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.showReminders}
              onChange={() => handleNotificationChange('showReminders')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Display</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600">Use dark theme</p>
            </div>
            <input
              type="checkbox"
              checked={appearance.darkMode}
              onChange={() => handleAppearanceChange('darkMode')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-gray-600">Show more content per page</p>
            </div>
            <input
              type="checkbox"
              checked={appearance.compactView}
              onChange={() => handleAppearanceChange('compactView')}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Account Security</h2>
        </div>
        <div className="space-y-4">
          <Button variant="outline" className="w-full sm:w-auto" disabled>
            Change Password
          </Button>
          <p className="text-sm text-gray-600">
            Password changes will be available in a future update.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default withAuth(SettingsClient);