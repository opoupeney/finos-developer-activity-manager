
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import { Content } from '@/types/content';
import { parseISO, isSameDay, isSameMonth, format, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStatusColor } from './TimelineUtils';
import { CalendarIcon, MapPinIcon, ClockIcon, BookOpenIcon, ChevronDown, CalendarDaysIcon } from 'lucide-react';
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
  const [keyDatesOpen, setKeyDatesOpen] = useState(true);
  
  // State for selected items
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

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

  // Function to get key dates for a specific date
  const getKeyDatesForDate = (date: Date) => {
    // Check if we have a selected activity and if it has key dates
    if (!selectedActivity || !selectedActivity.keyDates) {
      return [];
    }

    // Return key dates that match the given date
    return selectedActivity.keyDates.filter(keyDate => {
      try {
        const keyDateValue = parseISO(keyDate.date);
        return isSameDay(keyDateValue, date);
      } catch (error) {
        console.error("Error parsing key date:", error);
        return false;
      }
    });
  };

  // Function to check if a date has key dates
  const hasKeyDatesForDate = (date: Date) => {
    return getKeyDatesForDate(date).length > 0;
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

  // Get key dates for the current month (only for the selected activity)
  const keyDatesForCurrentMonth = selectedActivity?.keyDates
    ? selectedActivity.keyDates.filter(keyDate => {
        try {
          const keyDateValue = parseISO(keyDate.date);
          return isSameMonth(keyDateValue, month);
        } catch (error) {
          console.error("Error parsing key date for month filtering:", error);
          return false;
        }
      }).sort((a, b) => {
        // Sort by date
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      })
    : [];

  // Function to get icon for content type
  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case 'document': return <BookOpenIcon className="h-4 w-4 text-blue-500" />;
      case 'presentation': return <BookOpenIcon className="h-4 w-4 text-green-500" />;
      case 'video': return <BookOpenIcon className="h-4 w-4 text-red-500" />;
      default: return <BookOpenIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Function to handle selecting an activity
  const handleSelectActivity = (activity: Activity) => {
    if (selectedActivity?.id === activity.id) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(activity);
      setSelectedContent(null); // Clear content selection
      // Open key dates section when an activity is selected
      if (activity.keyDates && activity.keyDates.length > 0) {
        setKeyDatesOpen(true);
      }
    }
  };

  // Function to handle selecting a content
  const handleSelectContent = (content: Content) => {
    if (selectedContent?.id === content.id) {
      setSelectedContent(null);
    } else {
      setSelectedContent(content);
      setSelectedActivity(null); // Clear activity selection
    }
  };

  // Check if a date should be highlighted based on selected activity or content
  const isDateHighlighted = (date: Date) => {
    // Activity date range highlighting
    if (selectedActivity) {
      try {
        const startDate = parseISO(selectedActivity.kickOffDate || selectedActivity.date);
        const endDate = parseISO(selectedActivity.endDate || selectedActivity.date);
        
        return isWithinInterval(date, { start: startDate, end: endDate });
      } catch (error) {
        console.error("Error checking date range for activity:", error);
      }
    }
    
    // Content date highlighting (using publication date)
    if (selectedContent && selectedContent.publication_date) {
      try {
        const pubDate = parseISO(selectedContent.publication_date);
        return isSameDay(date, pubDate);
      } catch (error) {
        console.error("Error checking content publication date:", error);
      }
    }
    
    return false;
  };

  // Format the date string
  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy h:mm a');
      }
      return dateStr;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateStr;
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
                  hasKeyDate: (date) => hasKeyDatesForDate(date),
                  highlighted: (date) => isDateHighlighted(date)
                }}
                modifiersClassNames={{
                  hasActivity: "font-bold",
                  hasKeyDate: "underline", // Underline dates that have key dates
                  highlighted: "bg-blue-100 dark:bg-blue-900/30 text-foreground"
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dayActivities = getActivitiesForDate(date);
                    const hasActivities = dayActivities.length > 0;
                    const dayKeyDates = getKeyDatesForDate(date);
                    const hasKeyDates = dayKeyDates.length > 0;

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div>{date.getDate()}</div>
                        
                        {(hasActivities || hasKeyDates) && (
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1">
                            {/* Activity indicators */}
                            {dayActivities.slice(0, 3).map((activity, i) => (
                              <Tooltip key={`activity-${i}`}>
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
                            
                            {/* Key date indicators */}
                            {hasKeyDates && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1 max-w-xs">
                                    <p className="font-semibold">Key Dates:</p>
                                    {dayKeyDates.map((keyDate, i) => (
                                      <div key={i} className="text-xs">
                                        <p className="font-medium">{keyDate.description}</p>
                                        <p>Owner: {keyDate.owner}</p>
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
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
                          const isSelected = selectedActivity?.id === activity.id;
                          
                          return (
                            <TableRow 
                              key={index}
                              className={cn(
                                "cursor-pointer hover:bg-muted/50 transition-colors",
                                isSelected && "bg-blue-100 dark:bg-blue-900/30"
                              )}
                              onClick={() => handleSelectActivity(activity)}
                            >
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
            
            {/* Key Dates Collapsible (only shown when an activity is selected) */}
            {selectedActivity && (
              <Collapsible
                open={keyDatesOpen}
                onOpenChange={setKeyDatesOpen}
                className="border rounded-md shadow-sm"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors rounded-t-md">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="mr-2 h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">
                      Key Dates for {selectedActivity.title}
                    </h3>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${keyDatesOpen ? "rotate-0" : "rotate-180"}`} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="p-4">
                  {(!selectedActivity.keyDates || keyDatesForCurrentMonth.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No key dates for this activity in the current month
                    </div>
                  ) : (
                    <ScrollArea className="h-[250px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Owner</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keyDatesForCurrentMonth.map((keyDate, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <CalendarDaysIcon className="h-3 w-3 mr-1 text-purple-500" />
                                    {formatDateString(keyDate.date)}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{keyDate.description}</TableCell>
                                <TableCell>{keyDate.owner}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
            
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
                          const isSelected = selectedContent?.id === content.id;
                          
                          return (
                            <TableRow 
                              key={index}
                              className={cn(
                                "cursor-pointer hover:bg-muted/50 transition-colors",
                                isSelected && "bg-blue-100 dark:bg-blue-900/30"
                              )}
                              onClick={() => handleSelectContent(content)}
                            >
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
