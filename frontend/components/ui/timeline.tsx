import * as React from 'react';
import { cn } from '../../lib/utils';

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, align = 'start', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative space-y-4',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        className
      )}
      {...props}
    />
  )
);
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative pb-4 pl-6 last:pb-0', className)}
    {...props}
  />
));
TimelineItem.displayName = 'TimelineItem';

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute left-0 top-1 h-3 w-3 rounded-full border border-primary bg-background',
      className
    )}
    {...props}
  />
));
TimelineDot.displayName = 'TimelineDot';

const TimelineLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute left-1.5 top-6 h-[calc(100%-24px)] w-[1px] -translate-x-1/2 bg-border',
      className
    )}
    {...props}
  />
));
TimelineLine.displayName = 'TimelineLine';

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pt-0.5', className)}
    {...props}
  />
));
TimelineContent.displayName = 'TimelineContent';

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
TimelineDescription.displayName = 'TimelineDescription';

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
};