import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/navigation';

interface MobileNavProps {
  items: NavItem[];
  onClose: () => void;
}

export function MobileNav({ items, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 text-sm font-medium ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={onClose}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}