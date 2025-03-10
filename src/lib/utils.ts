
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
