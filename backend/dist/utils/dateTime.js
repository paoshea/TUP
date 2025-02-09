"use strict";
/**
 * Utility functions for handling dates and times
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRange = exports.parseDate = exports.getRelativeTimeString = exports.getDaysDifference = exports.isFuture = exports.isPast = exports.isToday = exports.subtractDays = exports.addDays = exports.endOfDay = exports.startOfDay = exports.formatReadableDate = exports.formatISODate = void 0;
/**
 * Format a date to ISO string without milliseconds
 */
const formatISODate = (date) => {
    return date.toISOString().split('.')[0] + 'Z';
};
exports.formatISODate = formatISODate;
/**
 * Format a date to a human-readable string
 */
const formatReadableDate = (date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
exports.formatReadableDate = formatReadableDate;
/**
 * Get the start of a day (midnight)
 */
const startOfDay = (date = new Date()) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
exports.startOfDay = startOfDay;
/**
 * Get the end of a day (23:59:59.999)
 */
const endOfDay = (date = new Date()) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
};
exports.endOfDay = endOfDay;
/**
 * Add days to a date
 */
const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};
exports.addDays = addDays;
/**
 * Subtract days from a date
 */
const subtractDays = (date, days) => {
    return (0, exports.addDays)(date, -days);
};
exports.subtractDays = subtractDays;
/**
 * Check if a date is today
 */
const isToday = (date) => {
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
};
exports.isToday = isToday;
/**
 * Check if a date is in the past
 */
const isPast = (date) => {
    return date.getTime() < Date.now();
};
exports.isPast = isPast;
/**
 * Check if a date is in the future
 */
const isFuture = (date) => {
    return date.getTime() > Date.now();
};
exports.isFuture = isFuture;
/**
 * Get the difference between two dates in days
 */
const getDaysDifference = (date1, date2) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
exports.getDaysDifference = getDaysDifference;
/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days")
 */
const getRelativeTimeString = (date) => {
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
    return (0, exports.formatReadableDate)(date);
};
exports.getRelativeTimeString = getRelativeTimeString;
/**
 * Parse a date string safely
 */
const parseDate = (dateString) => {
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
};
exports.parseDate = parseDate;
/**
 * Get the start and end dates for a given time range
 */
const getDateRange = (range) => {
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
exports.getDateRange = getDateRange;
