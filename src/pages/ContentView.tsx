import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity } from '@/types/activity';
import { getActivity } from '@/services/activityService';
import FinosHeader from '../components/FinosHeader';
import Breadcrumb from '../components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ContentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Activity ID is missing.');
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        const fetchedActivity = await getActivity(id);
        setActivity(fetchedActivity);
        setLoading(false);
      } catch (err) {
        setError('Failed to load activity.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) {
    return <div>Loading activity...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activity) {
    return <div>Activity not found.</div>;
  }

  const handleEdit = () => {
    if (userDetails && userDetails.role === 'admin') {
      navigate(`/activity/edit/${id}`);
    } else {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit developer activities",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <div className="breadcrumb-container">
          <Breadcrumb />
        </div>
      </div>
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <Button variant="ghost" onClick={() => navigate('/activity')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {activity.title}
            </h1>
            {userDetails?.role === 'admin' && (
              <Button onClick={handleEdit} className="bg-finos-blue hover:bg-finos-blue/90">
                <Edit className="mr-2 h-4 w-4" />
                Edit Activity
              </Button>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            View details about this developer activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 lg:col-span-2">
            <div className="bg-card rounded-md shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.marketingDescription}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-md shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <div className="space-y-2">
                <div>
                  <strong>Type:</strong> {activity.type}
                </div>
                <div>
                  <strong>Date:</strong> {format(new Date(activity.date), 'MMMM yyyy')}
                </div>
                <div>
                  <strong>Kick-off Date:</strong> {format(new Date(activity.kickOffDate), 'PPP')}
                </div>
                <div>
                  <strong>End Date:</strong> {format(new Date(activity.endDate), 'PPP')}
                </div>
                <div>
                  <strong>Location:</strong> {activity.location}
                </div>
                <div>
                  <strong>Marketing Campaign:</strong> {activity.marketingCampaign}
                </div>
                <div>
                  <strong>Status:</strong> {activity.status}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md shadow-md p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Ownership</h2>
              <div className="space-y-2">
                <div>
                  <strong>FINOS Lead:</strong> {activity.ownership.finosLead}
                </div>
                <div>
                  <strong>FINOS Team:</strong> {activity.ownership.finosTeam.join(', ')}
                </div>
                <div>
                  <strong>Marketing Liaison:</strong> {activity.ownership.marketingLiaison}
                </div>
                <div>
                  <strong>Member Success Liaison:</strong> {activity.ownership.memberSuccessLiaison}
                </div>
                <div>
                  <strong>Sponsors/Partners:</strong> {activity.ownership.sponsorsPartners.join(', ')}
                </div>
                <div>
                  <strong>Channel:</strong> {activity.ownership.channel}
                </div>
                <div>
                  <strong>Ambassador:</strong> {activity.ownership.ambassador}
                </div>
                <div>
                  <strong>TOC:</strong> {activity.ownership.toc}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md shadow-md p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Impacts & Metrics</h2>
              <div className="space-y-2">
                <div>
                  <strong>Use Case:</strong> {activity.impacts.useCase}
                </div>
                <div>
                  <strong>Strategic Initiative:</strong> {activity.impacts.strategicInitiative}
                </div>
                <div>
                  <strong>Projects:</strong> {activity.impacts.projects.join(', ')}
                </div>
                <div>
                  <strong>Targeted Personas:</strong> {activity.impacts.targetedPersonas.join(', ')}
                </div>
                <div>
                  <strong>Targeted Registrations:</strong> {activity.metrics.targetedRegistrations}
                </div>
                <div>
                  <strong>Current Registrations:</strong> {activity.metrics.currentRegistrations}
                </div>
                <div>
                  <strong>Targeted Participants:</strong> {activity.metrics.targetedParticipants}
                </div>
                <div>
                  <strong>Current Participants:</strong> {activity.metrics.currentParticipants}
                </div>
              </div>
            </div>
          </div>
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

export default ContentView;
