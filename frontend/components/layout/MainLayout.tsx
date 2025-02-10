import { useState } from 'react';
import { Home, ClipboardList, Award, Camera, User } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { MobileNav } from '../MobileNav';

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
      {/* Main content with padding for bottom navigation on mobile */}
      <main className="pb-16 md:pb-0">
        {children}
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