import { useState } from 'react';
import { Home, ClipboardList, Award, Camera, User } from 'lucide-react';
import type { NavItem } from '@/types/navigation';
import { Header, MobileNav } from './Navigation';

const navigationItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Evaluations',
    href: '/evaluations',
    icon: ClipboardList,
  },
  {
    label: 'Shows',
    href: '/shows',
    icon: Award,
  },
  {
    label: 'Camera',
    href: '/camera',
    icon: Camera,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main content with padding for header and bottom navigation */}
      <main className="pt-16 pb-16 md:pb-0">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav
        items={navigationItems}
        onClose={() => setIsNavOpen(false)}
      />
    </div>
  );
}

export default MainLayout;