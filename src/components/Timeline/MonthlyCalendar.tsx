
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { parseISO, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from './TimelineUtils';
import { DayClickEventHandler, DayContent, DayContentProps } from 'react-day-picker';

interface MonthlyCalendarProps {
  activities: Activity[];
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ activities }) => {
  const [month, setMonth] = useState<Date>(new Date());

  // Function to get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    return activities.filter((activity) => {
      try {
        const activityDate = parseISO(activity.date);
        return isSameDay(activityDate, date);
      } catch (error) {
        console.error("Error parsing date:", error);
        return false;
      }
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          className="p-3"
          modifiers={{
            hasActivity: (date) => getActivitiesForDate(date).length > 0,
          }}
          modifiersClassNames={{
            hasActivity: "font-bold",
          }}
          components={{
            DayContent: (props: DayContentProps) => {
              const dayActivities = getActivitiesForDate(props.date);
              const hasActivities = dayActivities.length > 0;

              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <DayContent {...props} />
                  
                  {hasActivities && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1">
                      {dayActivities.slice(0, 3).map((activity, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`h-1.5 w-1.5 rounded-full ${getStatusColor(activity.status)}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1 max-w-xs">
                              <p className="font-semibold">{activity.title}</p>
                              <p className="text-xs">{activity.type}</p>
                              {activity.location && <p className="text-xs">{activity.location}</p>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      
                      {dayActivities.length > 3 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{dayActivities.length - 3} more activities</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          }}
          showOutsideDays={true}
          disabled={false}
        />
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendar;
