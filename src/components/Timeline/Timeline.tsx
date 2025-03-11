
import React, { useState, useRef } from 'react';
import { Activity } from '@/types/activity';
import { startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import TimelineHeader from './TimelineHeader';
import DateHeader from './DateHeader';
import TimelineContent from './TimelineContent';

interface TimelineProps {
  activities: Activity[];
}

const Timeline: React.FC<TimelineProps> = ({ activities }) => {
  const [scale, setScale] = useState(1); // 1 = month view, 2 = quarter view
  const [viewDate, setViewDate] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full space-y-4 relative">
      <TimelineHeader 
        viewDate={viewDate}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <div
        className="overflow-x-auto pb-4 border rounded-md"
        onScroll={handleScroll}
        ref={timelineRef}
      >
        {/* Timeline header - dates */}
        <DateHeader datesInView={datesInView} dayWidth={dayWidth} />

        {/* Timeline content */}
        <TimelineContent 
          activities={activities}
          datesInView={datesInView}
          startDate={startDate}
          endDate={endDate}
          dayWidth={dayWidth}
          timelineWidth={timelineWidth}
        />
      </div>
    </div>
  );
};

export default Timeline;
