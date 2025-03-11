
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getActivityByID } from '@/services/activityService';
import FinosHeader from '@/components/FinosHeader';
import ActivityHeader from '@/components/ActivityHeader';
import ActivityDetails from '@/components/ActivityDetails';
import ActivityStats from '@/components/ActivityStats';
import DetailCard from '@/components/DetailCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ActivityView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';

  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityByID(id!),
    enabled: !!id,
    meta: {
      onError: (err: any) => {
        console.error("Error loading activity data:", err);
        toast({
          title: "Error loading data",
          description: err.message || "There was a problem retrieving the activity information",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activity || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500">Activity not found</h2>
            <p className="text-muted-foreground mt-2">Could not load activity information</p>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold truncate">
              {activity.title}
            </h1>
          </div>
          {isAdmin && (
            <Button asChild>
              <div 
                onClick={() => navigate(`/edit/${activity.id}`)}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Activity
              </div>
            </Button>
          )}
        </div>
        
        <ActivityHeader activity={activity} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ActivityDetails activity={activity} />
          </div>
          <div>
            <ActivityStats activity={activity} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DetailCard
            title="Ownership"
            items={[
              { label: 'FINOS Lead', value: activity.ownership.finosLead },
              { label: 'FINOS Team', value: activity.ownership.finosTeam.join(', ') },
              { label: 'Marketing Liaison', value: activity.ownership.marketingLiaison },
              { label: 'Member Success Liaison', value: activity.ownership.memberSuccessLiaison },
              { label: 'Sponsors/Partners', value: activity.ownership.sponsorsPartners.join(', ') },
              { label: 'Channel', value: activity.ownership.channel },
              { label: 'Ambassador', value: activity.ownership.ambassador },
              { label: 'TOC', value: activity.ownership.toc },
            ]}
          />
          
          <DetailCard
            title="Impacts"
            items={[
              { label: 'Use Case', value: activity.impacts.useCase },
              { label: 'Strategic Initiative', value: activity.impacts.strategicInitiative },
              { label: 'Projects', value: activity.impacts.projects.join(', ') },
              { label: 'Targeted Personas', value: activity.impacts.targetedPersonas.join(', ') },
            ]}
          />
        </div>
      </main>
      
      <footer className="border-t py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} FINOS - Fintech Open Source Foundation
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ActivityView;
