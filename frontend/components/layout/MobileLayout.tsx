import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  hideNavigation?: boolean;
}

export function MobileLayout({
  children,
  className,
  header,
  footer,
  hideNavigation = false,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with safe area padding */}
      {header && (
        <header className={cn(
          "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "pt-safe-top",
        )}>
          <div className="container flex h-14 items-center">
            {header}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={cn(
        "flex-1 container pb-safe-bottom",
        !hideNavigation && "pb-[80px]", // Space for bottom navigation
        className
      )}>
        {children}
      </main>

      {/* Footer/Navigation */}
      {!hideNavigation && (
        <nav className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-t pb-safe-bottom"
        )}>
          <div className="container h-[60px] flex items-center justify-around">
            {footer}
          </div>
        </nav>
      )}
    </div>
  );
}

interface MobilePageProps {
  children: ReactNode;
  className?: string;
}

export function MobilePage({ children, className }: MobilePageProps) {
  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto py-4 px-4 sm:px-6 space-y-6",
      className
    )}>
      {children}
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "p-4 touch:p-6", // Larger padding on touch devices
      className
    )}>
      {children}
    </div>
  );
}

interface MobileButtonProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function MobileButton({
  children,
  className,
  fullWidth = false,
  onClick,
}: MobileButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "touch:min-h-[44px]", // Minimum touch target size
        "bg-primary text-primary-foreground hover:bg-primary/90",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}

interface MobileInputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MobileInput({
  className,
  type = "text",
  placeholder,
  value,
  onChange,
}: MobileInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "touch:h-12 touch:text-base", // Larger on touch devices
        className
      )}
    />
  );
}