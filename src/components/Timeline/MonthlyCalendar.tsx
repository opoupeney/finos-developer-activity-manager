
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { Content } from '@/types/content';
import { parseISO, isSameDay, isSameMonth, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from './TimelineUtils';
import { DayClickEventHandler, DayContent, DayContentProps } from 'react-day-picker';
import { CalendarIcon, MapPinIcon, ClockIcon, BookOpenIcon, ChevronDown } from 'lucide-react';
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MonthlyCalendarProps {
  activities: Activity[];
  contents: Content[];
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ activities, contents }) => {
  const [month, setMonth] = useState<Date>(new Date());
  const [activitiesOpen, setActivitiesOpen] = useState(true);
  const [contentsOpen, setContentsOpen] = useState(true);

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

  // Get contents for the current month
  const contentsForCurrentMonth = contents.filter((content) => {
    if (!content.publication_date) return false;
    
    try {
      const pubDate = parseISO(content.publication_date);
      return isSameMonth(pubDate, month);
    } catch (error) {
      console.error("Error parsing publication date for month filtering:", error);
      return false;
    }
  }).sort((a, b) => {
    // Sort by publication date
    const dateA = a.publication_date ? parseISO(a.publication_date) : new Date(0);
    const dateB = b.publication_date ? parseISO(b.publication_date) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  // Function to get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case 'document': return <BookOpenIcon className="h-4 w-4 text-blue-500" />;
      case 'presentation': return <BookOpenIcon className="h-4 w-4 text-green-500" />;
      case 'video': return <BookOpenIcon className="h-4 w-4 text-red-500" />;
      default: return <BookOpenIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
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
          <div className="space-y-6">
            {/* Activities Collapsible */}
            <Collapsible
              open={activitiesOpen}
              onOpenChange={setActivitiesOpen}
              className="border rounded-md shadow-sm"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors rounded-t-md">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-finos-blue" />
                  <h3 className="text-lg font-semibold">
                    {format(month, 'MMMM yyyy')} Activities
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${activitiesOpen ? "rotate-0" : "rotate-180"}`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="p-4">
                {activitiesForCurrentMonth.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities scheduled for this month
                  </div>
                ) : (
                  <ScrollArea className="h-[250px]">
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
              </CollapsibleContent>
            </Collapsible>
            
            {/* Contents Collapsible */}
            <Collapsible
              open={contentsOpen}
              onOpenChange={setContentsOpen}
              className="border rounded-md shadow-sm"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors rounded-t-md">
                <div className="flex items-center">
                  <BookOpenIcon className="mr-2 h-5 w-5 text-finos-blue" />
                  <h3 className="text-lg font-semibold">
                    {format(month, 'MMMM yyyy')} Published Content
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${contentsOpen ? "rotate-0" : "rotate-180"}`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="p-4">
                {contentsForCurrentMonth.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No content published for this month
                  </div>
                ) : (
                  <ScrollArea className="h-[250px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Publication Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contentsForCurrentMonth.map((content, index) => {
                          const pubDate = content.publication_date ? parseISO(content.publication_date) : null;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{content.title}</TableCell>
                              <TableCell>
                                {pubDate && (
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                                    {format(pubDate, 'MMM d, yyyy')}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {getContentTypeIcon(content.type || '')}
                                  <span className="ml-1 capitalize">{content.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>{content.author || 'Unknown'}</TableCell>
                              <TableCell>
                                <Badge className={
                                  content.status === 'published' ? 'bg-green-500 text-white' : 
                                  content.status === 'draft' ? 'bg-yellow-500 text-white' :
                                  'bg-gray-500 text-white'
                                }>
                                  {content.status || 'Unknown'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
