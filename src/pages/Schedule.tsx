
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllActivities } from '@/services/activityService';
import Timeline from '@/components/Timeline/Timeline';
import FinosHeader from '@/components/FinosHeader';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';
import DashboardLoading from '@/components/Dashboard/DashboardLoading';

const Schedule = () => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: getAllActivities,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Activity Schedule</h1>
        
        {isLoading ? (
          <DashboardLoading />
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive">Error loading activities</h2>
            <p className="text-muted-foreground mt-2">Please try again later.</p>
          </div>
        ) : (
          <Timeline activities={activities || []} />
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Schedule;
