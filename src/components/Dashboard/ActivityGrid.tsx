
import React, { useState } from 'react';
import { Activity } from '@/types/activity';
import { ChevronDown } from "lucide-react";
import ActivityCard from './ActivityCard';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ActivityGridProps {
  activities: Activity[];
  typeToIconMap: Record<string, React.ReactNode>;
  defaultIcon: React.ReactNode;
  isAdmin: boolean;
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ 
  activities, 
  typeToIconMap, 
  defaultIcon,
  isAdmin,
  title,
  icon,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-muted-foreground">No developer activities found</h2>
        <p className="text-muted-foreground mt-2">There are no developer activities available at the moment.</p>
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 my-4 activity-section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <CollapsibleTrigger asChild>
          <button className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "" : "transform -rotate-90"}`} />
            <span className="sr-only">Toggle {title}</span>
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 print:!grid-cols-3">
          {activities.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity}
              icon={typeToIconMap[activity.type] || defaultIcon}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ActivityGrid;
