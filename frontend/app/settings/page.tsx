"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  fields: SettingsField[];
}

interface SettingsField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'toggle';
  value?: string | boolean;
  options?: { label: string; value: string }[];
  description?: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information and preferences.',
    fields: [
      {
        id: 'name',
        label: 'Full Name',
        type: 'text',
        value: 'John Doe'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        value: 'john@example.com'
      },
      {
        id: 'organization',
        label: 'Organization',
        type: 'text',
        value: 'TUP Farms'
      }
    ]
  },
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Control how you receive notifications.',
    fields: [
      {
        id: 'email_notifications',
        label: 'Email Notifications',
        type: 'toggle',
        value: true,
        description: 'Receive important updates via email'
      },
      {
        id: 'push_notifications',
        label: 'Push Notifications',
        type: 'toggle',
        value: true,
        description: 'Receive notifications on your device'
      },
      {
        id: 'notification_frequency',
        label: 'Notification Frequency',
        type: 'select',
        value: 'daily',
        options: [
          { label: 'Real-time', value: 'realtime' },
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' }
        ]
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize how the application looks.',
    fields: [
      {
        id: 'theme',
        label: 'Theme',
        type: 'select',
        value: 'system',
        options: [
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' }
        ]
      },
      {
        id: 'compact_view',
        label: 'Compact View',
        type: 'toggle',
        value: false,
        description: 'Use a more compact layout'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Manage your security settings and data preferences.',
    fields: [
      {
        id: 'two_factor',
        label: 'Two-Factor Authentication',
        type: 'toggle',
        value: false,
        description: 'Add an extra layer of security'
      },
      {
        id: 'data_sharing',
        label: 'Data Sharing',
        type: 'toggle',
        value: true,
        description: 'Share anonymous usage data to improve the platform'
      }
    ]
  }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(settingsSections);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string | boolean) => {
    setSettings(prevSettings =>
      prevSettings.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            fields: section.fields.map(field => {
              if (field.id === fieldId) {
                return { ...field, value };
              }
              return field;
            }),
          };
        }
        return section;
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving settings:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderToggle = (sectionId: string, field: SettingsField) => {
    const isChecked = Boolean(field.value);
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked ? "true" : "false"}
        className={`${
          isChecked ? 'bg-primary' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        onClick={() => handleFieldChange(sectionId, field.id, !field.value)}
      >
        <span
          aria-hidden="true"
          className={`${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {settings.map(section => (
          <Card key={section.id} className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-6">{section.description}</p>

            <div className="space-y-6">
              {section.fields.map(field => (
                <div key={field.id}>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    {field.description && (
                      <span className="text-sm text-gray-500">
                        {field.description}
                      </span>
                    )}
                  </div>

                  {field.type === 'toggle' ? (
                    renderToggle(section.id, field)
                  ) : field.type === 'select' ? (
                    <select
                      id={field.id}
                      value={field.value as string}
                      onChange={(e) =>
                        handleFieldChange(section.id, field.id, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      value={field.value as string}
                      onChange={(e) =>
                        handleFieldChange(section.id, field.id, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}