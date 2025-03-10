
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Invalid date';
  }
}

export function compareValues(valueA: any, valueB: any, direction: 'asc' | 'desc' = 'asc'): number {
  // Handle null, undefined or empty values
  if (valueA === null || valueA === undefined || valueA === '') {
    return direction === 'asc' ? -1 : 1;
  }
  if (valueB === null || valueB === undefined || valueB === '') {
    return direction === 'asc' ? 1 : -1;
  }

  // Handle dates
  if (isDateString(valueA) && isDateString(valueB)) {
    const dateA = new Date(valueA);
    const dateB = new Date(valueB);
    return direction === 'asc' 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  }

  // Handle strings (case insensitive)
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    const comparison = valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    return direction === 'asc' ? comparison : -comparison;
  }

  // Handle numbers
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return direction === 'asc' ? valueA - valueB : valueB - valueA;
  }

  // Default comparison
  const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  return direction === 'asc' ? comparison : -comparison;
}

// Helper to check if a string is a valid date
function isDateString(value: any): boolean {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}
