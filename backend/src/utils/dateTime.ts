/**
 * Utility functions for handling dates and times
 */

/**
 * Format a date to ISO string without milliseconds
 */
export const formatISODate = (date: Date): string => {
  return date.toISOString().split('.')[0] + 'Z';
};

/**
 * Format a date to a human-readable string
 */
export const formatReadableDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get the start of a day (midnight)
 */
export const startOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get the end of a day (23:59:59.999)
 */
export const endOfDay = (date: Date = new Date()): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date.getTime() < Date.now();
};

/**
 * Check if a date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date.getTime() > Date.now();
};

/**
 * Get the difference between two dates in days
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return formatReadableDate(date);
};

/**
 * Parse a date string safely
 */
export const parseDate = (dateString: string): Date | null => {
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Get the start and end dates for a given time range
 */
export const getDateRange = (
  range: 'today' | 'week' | 'month' | 'year'
): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};