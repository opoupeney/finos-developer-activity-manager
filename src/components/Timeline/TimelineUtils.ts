
// Helper functions for the Timeline component
import { Activity } from '@/types/activity';
import { differenceInDays, isBefore, isAfter, isSameDay, parseISO } from 'date-fns';

// Get background color based on activity status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Approved':
      return 'bg-finos-green/90 hover:bg-finos-green/100';
    case 'Pending':
      return 'bg-yellow-500/80 hover:bg-yellow-500/90';
    case 'Done':
      return 'bg-gray-400/80 hover:bg-gray-400/90';
    default:
      return 'bg-primary/10 hover:bg-primary/20';
  }
};

// Calculate position of an activity on the timeline
export const calculateActivityPosition = (
  activity: Activity,
  startDate: Date,
  endDate: Date
): number | null => {
  try {
    const activityDate = parseISO(activity.date);
    
    // If activity is not in the current view, don't display it
    if (isAfter(activityDate, endDate) || isBefore(activityDate, startDate)) {
      return null;
    }

    // Calculate the position
    return Math.max(0, differenceInDays(activityDate, startDate));
  } catch (error) {
    console.error("Error calculating activity position:", error, activity);
    return null;
  }
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Filter out rejected activities
export const filterValidActivities = (activities: Activity[]): Activity[] => {
  return activities.filter(activity => activity.status !== 'Rejected');
};
