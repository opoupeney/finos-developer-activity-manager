
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineHeaderProps {
  viewDate: Date;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ 
  viewDate, 
  scale, 
  onZoomIn, 
  onZoomOut, 
  onPrevious, 
  onNext 
}) => {
  return (
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
        <Button variant="outline" size="sm" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimelineHeader;
