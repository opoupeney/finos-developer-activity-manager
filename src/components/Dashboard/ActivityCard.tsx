
import React from 'react';
import { Link } from 'react-router-dom';
import { Masterclass } from '@/types/masterclass';
import StatusBadge from '../StatusBadge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { format } from 'date-fns';

interface ActivityCardProps {
  activity: Masterclass;
  icon: React.ReactNode;
  isAdmin: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, icon, isAdmin }) => {
  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy');
      }
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
    }
  };

  return (
    <Card className="stats-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold flex items-center">
            {icon}
            {activity.title}
          </CardTitle>
          <StatusBadge status={activity.status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {formatDateString(activity.date)}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finos-blue">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {activity.location}
          </div>
          
          <div className="mt-4">
            <div className="text-sm font-medium flex justify-between mb-1">
              <span>Registration Progress</span>
              <span>{activity.metrics.registrationPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-finos-blue transition-all duration-500 ease-out rounded-full"
                style={{ width: `${activity.metrics.registrationPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {activity.metrics.currentRegistrations} of {activity.metrics.targetedRegistrations} registrations
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/masterclass/${activity.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
        
        {isAdmin && (
          <Button asChild variant="outline" className="w-10 p-0 flex-none">
            <Link to={`/edit/${activity.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
