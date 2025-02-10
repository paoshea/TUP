import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import React from 'react';

interface MobileNavProps {
  items: NavItem[];
  onClose: () => void;
}

export const MobileNav = ({ items, onClose }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Handle swipe gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 100) { // Min swipe distance
        if (swipeDistance > 0 && !isOpen) {
          // Swipe right to open
          setIsOpen(true);
        } else if (swipeDistance < 0 && isOpen) {
          // Swipe left to close
          setIsOpen(false);
          onClose();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  // Hamburger menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {React.createElement(isOpen ? X : Menu, {
          className: "w-6 h-6",
          "aria-hidden": "true"
        })}
      </button>

      {/* Slide-out Navigation Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="h-full pt-16 pb-20">
          <ul className="px-4 space-y-4">
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    onClose();
                  }}
                >
                  {React.createElement(item.icon, {
                    className: "w-6 h-6",
                    "aria-hidden": "true"
                  })}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <ul className="flex justify-around items-center h-16">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className={`flex flex-col items-center p-2 ${
                  router.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {React.createElement(item.icon, {
                  className: "w-6 h-6",
                  "aria-hidden": "true"
                })}
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => {
            setIsOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default MobileNav;