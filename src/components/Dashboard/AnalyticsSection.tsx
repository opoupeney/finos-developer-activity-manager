
import React, { useState } from 'react';
import { Masterclass } from '@/types/masterclass';
import { ChartPieIcon, ChevronDown } from "lucide-react";
import PieCharts from '../PieCharts';
import ActivityProgressKnob from '../Charts/ActivityProgressKnob';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AnalyticsSectionProps {
  activities: Masterclass[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ activities }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!activities || activities.length === 0) {
    return null;
  }

  // Count non-declined activities
  const nonDeclinedActivities = activities.filter(
    activity => activity.status !== 'Rejected'
  ).length;

  // Set threshold
  const threshold = 70;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2 my-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartPieIcon className="h-5 w-5 text-finos-blue" />
          <h2 className="text-xl font-semibold">Activity Analytics</h2>
        </div>
        <CollapsibleTrigger asChild>
          <button className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "" : "transform -rotate-90"}`} />
            <span className="sr-only">Toggle Activity Analytics</span>
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <ActivityProgressKnob 
            value={nonDeclinedActivities} 
            maxValue={threshold} 
            title="Active Activities" 
            description={`${nonDeclinedActivities} of ${threshold} target activities`}
          />
          <div className="md:col-span-3">
            <PieCharts activities={activities} />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalyticsSection;
