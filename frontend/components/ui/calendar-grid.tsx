import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';

export type CalendarGridProps = React.ComponentProps<typeof DayPicker>;

function CalendarGrid({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarGridProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'grid grid-cols-7',
        head_cell:
          'text-muted-foreground rounded-md w-full font-normal text-[0.8rem] h-9 flex items-center justify-center',
        row: 'grid grid-cols-7 mt-2',
        cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-full p-0 font-normal aria-selected:opacity-100'
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
CalendarGrid.displayName = 'CalendarGrid';

export { CalendarGrid };