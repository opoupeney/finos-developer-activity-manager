
import React, { useState, useRef } from 'react';
import { Activity } from '@/types/activity';
import { format, differenceInDays, startOfMonth, endOfMonth, parseISO, isAfter, isBefore, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineProps {
  activities: Activity[];
}

const Timeline: React.FC<TimelineProps> = ({ activities }) => {
  const [scale, setScale] = useState(1); // 1 = month view, 2 = quarter view
  const [viewDate, setViewDate] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter out rejected activities
  const validActivities = activities.filter(activity => activity.status !== 'Rejected');

  // Set start and end dates based on the scale
  const startDate = startOfMonth(viewDate);
  const endDate = scale === 1
    ? endOfMonth(viewDate)
    : endOfMonth(new Date(viewDate.getFullYear(), viewDate.getMonth() + 2, 1));

  const totalDays = differenceInDays(endDate, startDate) + 1;
  const dayWidth = 60; // Width of each day in pixels
  const timelineWidth = totalDays * dayWidth;

  // Generate array of dates in the current view
  const datesInView = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  // Handle zooming
  const handleZoomIn = () => {
    if (scale > 0.5) {
      setScale(scale - 0.5);
    }
  };

  const handleZoomOut = () => {
    if (scale < 3) {
      setScale(scale + 0.5);
    }
  };

  // Handle navigation
  const handlePrevious = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() - (scale >= 2 ? 3 : 1));
    setViewDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + (scale >= 2 ? 3 : 1));
    setViewDate(newDate);
  };

  // Handle horizontal scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  // Get background color based on activity status
  const getStatusColor = (status: string) => {
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

  // Position activities on the timeline - ONLY using activity.date now
  const positionActivity = (activity: Activity) => {
    try {
      // Now ONLY using the activity.date for positioning
      const activityDate = parseISO(activity.date);
      
      // If activity is not in the current view, don't display it
      if (isAfter(activityDate, endDate) || isBefore(activityDate, startDate)) {
        return null;
      }

      // Calculate the position
      const startPos = Math.max(0, differenceInDays(activityDate, startDate));
      const statusColor = getStatusColor(activity.status);

      return (
        <TooltipProvider key={activity.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={`/activity/${activity.id}`}
                className="absolute rounded group hover:z-20"
                style={{
                  left: `${startPos * dayWidth}px`,
                  width: `${dayWidth}px`, // Each activity takes up exactly one day
                  top: '5px', // Adjust as needed
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
        </TooltipProvider>
      );
    } catch (error) {
      console.error("Error positioning activity:", error, activity);
      return null;
    }
  };

  return (
    <div className="w-full space-y-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">
            {scale === 1
              ? format(viewDate, 'MMMM yyyy')
              : `${format(viewDate, 'MMM')} - ${format(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + (scale >= 2 ? 2 : 0), 1),
                  'MMM yyyy'
                )}`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="overflow-x-auto pb-4 border rounded-md"
        onScroll={handleScroll}
        ref={timelineRef}
      >
        {/* Timeline header - dates */}
        <div className="flex sticky top-0 bg-background z-10 border-b">
          {datesInView.map((date, i) => (
            <div
              key={i}
              className={`flex-shrink-0 text-center py-2 border-r last:border-r-0 ${
                date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/50' : ''
              }`}
              style={{ width: `${dayWidth}px` }}
            >
              <div className="text-xs font-medium">{format(date, 'EEE')}</div>
              <div className="text-sm">{format(date, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Timeline content */}
        <div className="relative min-h-[200px]" style={{ width: `${timelineWidth}px` }}>
          {/* Today indicator */}
          {datesInView.some(date => isSameDay(date, new Date())) && (
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
            {validActivities.map(activity => positionActivity(activity))}
          </div>
        </div>
      </div>

      {validActivities.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-muted-foreground">No activities found</h2>
          <p className="text-muted-foreground mt-2">There are no activities available for this time period.</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
