
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number;
  target: number;
  percentage: number;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  value, 
  target, 
  percentage, 
  className 
}) => {
  const circleSize = 120;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className={cn("stats-card overflow-hidden", className)}>
      <CardContent className="p-6 flex flex-col items-center">
        <h3 className="text-lg font-medium text-muted-foreground mb-4">{title}</h3>
        
        <div className="relative flex items-center justify-center mb-2">
          <svg width={circleSize} height={circleSize} className="transform -rotate-90">
            <circle
              className="text-muted stroke-current"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
            <circle
              className="progress-ring text-finos-blue stroke-current"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold animate-fade-in">{value}</span>
            <span className="text-sm text-muted-foreground">of {target}</span>
          </div>
        </div>
        
        <div className="text-lg font-semibold text-finos-blue mt-2 animate-fade-in">
          {percentage}%
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
