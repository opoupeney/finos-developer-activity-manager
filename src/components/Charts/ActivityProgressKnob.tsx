
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ActivityProgressKnobProps {
  value: number;
  maxValue: number;
  title: string;
  description: string;
}

const ActivityProgressKnob: React.FC<ActivityProgressKnobProps> = ({ 
  value, 
  maxValue, 
  title,
  description 
}) => {
  // Calculate percentage (capped at 100%)
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative flex flex-col items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Circle background */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
            
            {/* Progress circle - using a radial progress approach */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#f3f4f6" 
                strokeWidth="8" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.51} 251`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
                className={getColorClass()}
              />
            </svg>
            
            {/* Value in the middle */}
            <div className="text-center">
              <span className="text-4xl font-bold">{value}</span>
              <span className="text-sm block text-muted-foreground">of {maxValue}</span>
            </div>
          </div>
          
          {/* Progress bar below */}
          <div className="w-full mt-4">
            <Progress 
              value={percentage} 
              className={`h-2 ${getColorClass()}`} 
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0</span>
              <span>{maxValue/2}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityProgressKnob;
