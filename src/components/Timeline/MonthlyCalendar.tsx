
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { parseISO, isSameDay, isSameMonth, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from './TimelineUtils';
import { DayClickEventHandler, DayContent, DayContentProps } from 'react-day-picker';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // Get activities for the current month
  const activitiesForCurrentMonth = activities.filter((activity) => {
    try {
      const activityDate = parseISO(activity.date);
      return isSameMonth(activityDate, month);
    } catch (error) {
      console.error("Error parsing date for month filtering:", error);
      return false;
    }
  }).sort((a, b) => {
    // Sort by date
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4">
        <Card className="border shadow-sm h-full w-full">
          <CardContent className="p-0 h-full flex flex-col">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              className="p-3 flex-1"
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
      </div>

      <div className="md:col-span-8">
        <Card className="border shadow-sm h-full">
          <CardContent className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-finos-blue" />
              {format(month, 'MMMM yyyy')} Activities
            </h3>
            
            {activitiesForCurrentMonth.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">
                No activities scheduled for this month
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  {activitiesForCurrentMonth.map((activity, index) => {
                    const activityDate = parseISO(activity.date);
                    
                    return (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium line-clamp-1">{activity.title}</h4>
                          <Badge variant="outline" className={cn(
                            "ml-2 flex-shrink-0", 
                            activity.status === 'Approved' ? "border-green-500 text-green-700" :
                            activity.status === 'Pending' ? "border-yellow-500 text-yellow-700" :
                            activity.status === 'Done' ? "border-gray-500 text-gray-700" :
                            "border-primary text-primary"
                          )}>
                            {activity.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-1">
                          {format(activityDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                        
                        {activity.location && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            <span className="line-clamp-1">{activity.location}</span>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs">
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>Registrations</span>
                            <span>{activity.metrics.registrationPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-finos-blue transition-all duration-500 ease-out rounded-full"
                              style={{ width: `${activity.metrics.registrationPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
