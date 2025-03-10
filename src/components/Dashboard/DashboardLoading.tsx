
import React from 'react';
import FinosHeader from '../FinosHeader';

const DashboardLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
