import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllMasterclasses } from '../services/masterclassService';
import FinosHeader from '../components/FinosHeader';
import { useToast } from "@/hooks/use-toast";
import { Activity, Building, BookOpen, Code, GraduationCap, MessageSquareCode, Mic, PenTool, Star, ListChecks, Archive } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import ActivityMap from '@/components/Map/ActivityMap';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardLoading from '@/components/Dashboard/DashboardLoading';
import ActivityGrid from '@/components/Dashboard/ActivityGrid';
import AnalyticsSection from '@/components/Dashboard/AnalyticsSection';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';

const typeToIconMap: Record<string, React.ReactNode> = {
  'Workshop': <PenTool className="h-5 w-5 mr-2 text-finos-blue" />,
  'Hackathon': <Code className="h-5 w-5 mr-2 text-finos-blue" />,
  'Conference': <Building className="h-5 w-5 mr-2 text-finos-blue" />,
  'TechTalk': <MessageSquareCode className="h-5 w-5 mr-2 text-finos-blue" />,
  'Masterclass': <GraduationCap className="h-5 w-5 mr-2 text-finos-blue" />,
  'Meetup': <Activity className="h-5 w-5 mr-2 text-finos-blue" />,
  'Webinar': <Mic className="h-5 w-5 mr-2 text-finos-blue" />,
  'Training': <BookOpen className="h-5 w-5 mr-2 text-finos-blue" />,
  'Awards': <Star className="h-5 w-5 mr-2 text-finos-blue" />,
};

const DefaultIcon = <Activity className="h-5 w-5 mr-2 text-finos-blue" />;

const Dashboard = () => {
  const { user, userDetails, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getAllMasterclasses(),
    enabled: !authLoading, // Only run query when auth loading is complete
    meta: {
      onSuccess: () => {
        toast({
          title: "Dashboard loaded",
          description: "Developer activities dashboard data has been retrieved",
        });
      },
      onError: (err: any) => {
        console.error("Error loading dashboard data:", err);
        toast({
          title: "Error loading dashboard",
          description: err.message || "There was a problem retrieving the developer activities information",
          variant: "destructive",
        });
      }
    }
  });

  // We only want to refetch when auth state changes from loading to not loading
  // Not on every render or auth state check
  useEffect(() => {
    // Only trigger a refetch when auth loading completes and we have a user
    if (!authLoading && user) {
      refetch();
    }
  }, [authLoading, user, refetch]);

  if (authLoading) {
    return <DashboardLoading />;
  }

  // Show loading state only if activities are being loaded AND we're not in the auth loading state
  if (activitiesLoading && !authLoading) {
    return <DashboardLoading />;
  }

  const isAdmin = userDetails?.role === 'admin';

  // Filter activities for pipeline (not done or rejected)
  const pipelineActivities = activities?.filter(activity => 
    activity.status !== 'Done' && activity.status !== 'Rejected'
  ) || [];

  // Filter activities for archive (done or rejected)
  const archivedActivities = activities?.filter(activity => 
    activity.status === 'Done' || activity.status === 'Rejected'
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <DashboardHeader isAdmin={isAdmin} />
        
        {activities && activities.length > 0 && (
          <div className="mb-8">
            <ActivityMap activities={activities} />
          </div>
        )}
        
        <AnalyticsSection activities={activities} />
        
        <ActivityGrid 
          activities={pipelineActivities} 
          typeToIconMap={typeToIconMap}
          defaultIcon={DefaultIcon}
          isAdmin={isAdmin}
          title="Activity Pipeline"
          icon={<ListChecks className="h-5 w-5 text-finos-blue" />}
          defaultOpen={true}
        />

        {archivedActivities.length > 0 && (
          <ActivityGrid 
            activities={archivedActivities} 
            typeToIconMap={typeToIconMap}
            defaultIcon={DefaultIcon}
            isAdmin={isAdmin}
            title="Activity Archive"
            icon={<Archive className="h-5 w-5 text-finos-blue" />}
            defaultOpen={false}
          />
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
