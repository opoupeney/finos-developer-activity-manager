
import React from 'react';
import { Activity } from '@/types/activity';
import { differenceInDays } from 'date-fns';
import { TooltipProvider } from "@/components/ui/tooltip";
import TimelineActivity from './TimelineActivity';
import { getStatusColor, calculateActivityPosition, isToday } from './TimelineUtils';

interface TimelineContentProps {
  activities: Activity[];
  datesInView: Date[];
  startDate: Date;
  endDate: Date;
  dayWidth: number;
  timelineWidth: number;
}

const TimelineContent: React.FC<TimelineContentProps> = ({
  activities,
  datesInView,
  startDate,
  endDate,
  dayWidth,
  timelineWidth,
}) => {
  return (
    <div className="relative min-h-[200px]" style={{ width: `${timelineWidth}px` }}>
      {/* Today indicator */}
      {datesInView.some(date => isToday(date)) && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary z-10"
          style={{
            left: `${differenceInDays(new Date(), startDate) * dayWidth + dayWidth / 2}px`,
          }}
        />
      )}

      {/* Weekend indicators */}
      {datesInView.map((date, i) => (
        (date.getDay() === 0 || date.getDay() === 6) && (
          <div
            key={`weekend-${i}`}
            className="absolute top-0 bottom-0 bg-muted/30 h-full"
            style={{
              left: `${i * dayWidth}px`,
              width: `${dayWidth}px`,
            }}
          />
        )
      ))}

      {/* Activities */}
      <div className="pt-4 px-2 relative">
        <TooltipProvider>
          {activities.map(activity => {
            const position = calculateActivityPosition(activity, startDate, endDate);
            if (position === null) return null;
            
            const statusColor = getStatusColor(activity.status);
            
            return (
              <TimelineActivity
                key={activity.id}
                activity={activity}
                position={position}
                dayWidth={dayWidth}
                statusColor={statusColor}
              />
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TimelineContent;
