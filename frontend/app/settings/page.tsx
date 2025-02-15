import SettingsClient from './SettingsClient';

// Prevent static generation for settings page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function SettingsPage() {
  return <SettingsClient />;
}