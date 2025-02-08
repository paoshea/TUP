import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';

interface CalendarGridProps extends React.HTMLAttributes<HTMLDivElement> {
  month: Date;
  selected?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CalendarGrid = React.forwardRef<HTMLDivElement, CalendarGridProps>(
  ({ month, selected, onDateSelect, className, ...props }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(month);
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    const days = React.useMemo(() => {
      const result = [];
      for (let i = 0; i < startingDay; i++) {
        result.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        result.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
      }
      return result;
    }, [currentMonth, startingDay, daysInMonth]);

    const handlePreviousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isSelected = (date: Date | null) => {
      if (!date || !selected) return false;
      return selected.toDateString() === date.toDateString();
    };

    const isToday = (date: Date | null) => {
      if (!date) return false;
      return new Date().toDateString() === date.toDateString();
    };

    return (
      <div
        ref={ref}
        className={cn('w-full space-y-4', className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'h-7 w-7'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </button>
          <div className="font-medium">
            {currentMonth.toLocaleDateString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <button
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'icon' }),
              'h-7 w-7'
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => date && onDateSelect?.(date)}
              disabled={!date}
              className={cn(
                'aspect-square rounded-md p-2 text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                !date && 'pointer-events-none opacity-50',
                date && 'hover:bg-accent hover:text-accent-foreground',
                isSelected(date) &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                isToday(date) && !isSelected(date) && 'bg-accent text-accent-foreground'
              )}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
CalendarGrid.displayName = 'CalendarGrid';

export { CalendarGrid };