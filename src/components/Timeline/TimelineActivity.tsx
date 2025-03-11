
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '@/types/activity';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineActivityProps {
  activity: Activity;
  position: number;
  dayWidth: number;
  statusColor: string;
}

const TimelineActivity: React.FC<TimelineActivityProps> = ({ 
  activity, 
  position, 
  dayWidth, 
  statusColor 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={`/activity/${activity.id}`}
          className="absolute rounded group hover:z-20"
          style={{
            left: `${position * dayWidth}px`,
            width: `${dayWidth}px`,
            top: '5px',
          }}
        >
          <Card className={`h-16 border transition-all ${statusColor} text-white shadow hover:shadow-md`}>
            <CardContent className="p-2 h-full flex items-center justify-center">
              <h3 className="text-xs font-medium text-center truncate group-hover:whitespace-normal">
                {activity.title}
              </h3>
            </CardContent>
          </Card>
        </Link>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{activity.title}</p>
          <p className="text-xs">{activity.type} • {format(parseISO(activity.date), 'MMM d, yyyy')}</p>
          {activity.location && <p className="text-xs">{activity.location}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default TimelineActivity;
