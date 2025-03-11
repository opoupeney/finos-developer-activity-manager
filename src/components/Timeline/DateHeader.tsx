
import React from 'react';
import { format } from 'date-fns';

interface DateHeaderProps {
  datesInView: Date[];
  dayWidth: number;
}

const DateHeader: React.FC<DateHeaderProps> = ({ datesInView, dayWidth }) => {
  return (
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
  );
};

export default DateHeader;
