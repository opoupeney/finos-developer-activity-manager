
import React from 'react';
import { Masterclass } from '@/types/masterclass';
import { ChartPieIcon } from "lucide-react";
import PieCharts from '../PieCharts';

interface AnalyticsSectionProps {
  activities: Masterclass[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4 mt-8">
        <ChartPieIcon className="h-5 w-5 text-finos-blue" />
        <h2 className="text-xl font-semibold">Activity Analytics</h2>
      </div>
      <PieCharts activities={activities} />
    </>
  );
};

export default AnalyticsSection;
