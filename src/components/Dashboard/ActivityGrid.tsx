
import React from 'react';
import { Masterclass } from '@/types/masterclass';
import { ChartPieIcon, Eye } from "lucide-react";
import ActivityCard from './ActivityCard';

interface ActivityGridProps {
  activities: Masterclass[];
  typeToIconMap: Record<string, React.ReactNode>;
  defaultIcon: React.ReactNode;
  isAdmin: boolean;
  title: string;
  icon: React.ReactNode;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ 
  activities, 
  typeToIconMap, 
  defaultIcon,
  isAdmin,
  title,
  icon
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No developer activities found</h2>
        <p className="text-muted-foreground mt-2">There are no developer activities available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4 mt-8">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity}
            icon={typeToIconMap[activity.type] || defaultIcon}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </>
  );
};

export default ActivityGrid;
