
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { parseISO, isSameDay, isSameMonth, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from './TimelineUtils';
import { DayClickEventHandler, DayContent, DayContentProps } from 'react-day-picker';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from '@/components/StatusBadge';

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
          <CardContent className="p-0 h-full flex flex-col items-center justify-center">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              className="p-3 flex-1 mx-auto"
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activitiesForCurrentMonth.map((activity, index) => {
                      const activityDate = parseISO(activity.date);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{activity.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                              {format(activityDate, 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>{activity.type}</TableCell>
                          <TableCell>
                            {activity.location && (
                              <div className="flex items-center">
                                <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="truncate max-w-[150px]">{activity.location}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={activity.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
