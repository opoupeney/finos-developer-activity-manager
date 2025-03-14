
import React from 'react';
import { Activity } from '../types/activity';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import MDEditor from '@uiw/react-md-editor';

interface ActivityHeaderProps {
  activity: Activity;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({ activity }) => {
  // Format the date string if it's a valid date
  const formatDateString = (dateStr: string) => {
    try {
      // Check if we have a valid date string
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy');
      }
      // If not a valid date, return the original string
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {activity.title}
        </h1>
        <StatusBadge status={activity.status} />
      </div>
      
      <div className="max-w-3xl">
        <div data-color-mode="light" className="mb-4">
          <MDEditor.Markdown source={activity.marketingDescription} />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center text-sm gap-x-6 gap-y-2 text-muted-foreground pt-2">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>Date: {formatDateString(activity.date)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Location: {activity.location}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M12 7c1-.56 2.78-2 5-2 .97 0 1.94.27 2.76.79" />
          </svg>
          <span>Campaign: {activity.marketingCampaign}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeader;
