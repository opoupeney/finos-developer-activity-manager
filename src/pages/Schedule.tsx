
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllActivities } from '@/services/activityService';
import { fetchContents } from '@/services/contentService';
import Timeline from '@/components/Timeline/Timeline';
import MonthlyCalendar from '@/components/Timeline/MonthlyCalendar';
import FinosHeader from '@/components/FinosHeader';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';
import DashboardLoading from '@/components/Dashboard/DashboardLoading';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ListIcon } from 'lucide-react';
import { filterValidActivities } from '@/components/Timeline/TimelineUtils';
import Breadcrumb from '@/components/Breadcrumb';

const Schedule = () => {
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');
  
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: ['activities'],
    queryFn: getAllActivities,
  });

  const { data: contents, isLoading: contentsLoading, error: contentsError } = useQuery({
    queryKey: ['contents'],
    queryFn: fetchContents,
  });

  const filteredActivities = activities ? filterValidActivities(activities) : [];
  const isLoading = activitiesLoading || contentsLoading;
  const error = activitiesError || contentsError;

  // Add some debug logging to check activities data
  useEffect(() => {
    if (filteredActivities && filteredActivities.length > 0) {
      console.log('Filtered activities:', filteredActivities);
      
      // Check which activities have key dates
      const activitiesWithKeyDates = filteredActivities.filter(
        activity => activity.keyDates && activity.keyDates.length > 0
      );
      
      console.log('Activities with key dates:', activitiesWithKeyDates);
      if (activitiesWithKeyDates.length > 0) {
        console.log('Sample key dates:', activitiesWithKeyDates[0].keyDates);
      }
    }
  }, [filteredActivities]);

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 pt-4">
          <Breadcrumb />
        </div>
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Activity Schedule</h1>
            
            <Tabs
              value={view}
              onValueChange={(value) => setView(value as 'timeline' | 'calendar')}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline" className="flex items-center gap-1">
                  <ListIcon className="h-4 w-4" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <DashboardLoading />
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-destructive">Error loading data</h2>
              <p className="text-muted-foreground mt-2">Please try again later.</p>
            </div>
          ) : (
            <div>
              {view === 'timeline' ? (
                <Timeline activities={filteredActivities} />
              ) : (
                <MonthlyCalendar activities={filteredActivities} contents={contents || []} />
              )}
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-muted-foreground">No activities found</h2>
                  <p className="text-muted-foreground mt-2">There are no activities available for this time period.</p>
                </div>
              )}
            </div>
          )}
        </main>
        
        <DashboardFooter />
      </div>
    </TooltipProvider>
  );
};

export default Schedule;
