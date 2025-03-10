
import React, { useState } from 'react';
import { Masterclass } from '@/types/masterclass';
import { ChartPieIcon, ChevronDown } from "lucide-react";
import PieCharts from '../PieCharts';
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
      
      <CollapsibleContent className="space-y-2">
        <PieCharts activities={activities} />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AnalyticsSection;
