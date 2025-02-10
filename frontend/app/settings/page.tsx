"use client";

import { useState } from 'react';
import { User, Bell, Shield, Layout, Moon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/context/AuthContext';

function SettingsPage() {
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
          <User className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
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
          <Bell className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive mobile notifications</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={() => handleNotificationChange('push')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Reminders</p>
              <p className="text-sm text-gray-600">Get show preparation reminders</p>
            </div>
            <Switch
              checked={notifications.showReminders}
              onCheckedChange={() => handleNotificationChange('showReminders')}
            />
          </div>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Layout className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600">Use dark theme</p>
            </div>
            <Switch
              checked={appearance.darkMode}
              onCheckedChange={() => handleAppearanceChange('darkMode')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-gray-600">Show more content per page</p>
            </div>
            <Switch
              checked={appearance.compactView}
              onCheckedChange={() => handleAppearanceChange('compactView')}
            />
          </div>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Security</h2>
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

export default withAuth(SettingsPage);