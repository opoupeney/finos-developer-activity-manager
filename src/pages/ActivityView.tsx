import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActivityByID, updateKeyDates } from '@/services/activityService';
import FinosHeader from '@/components/FinosHeader';
import ActivityHeader from '@/components/ActivityHeader';
import ActivityDetails from '@/components/ActivityDetails';
import ActivityStats from '@/components/ActivityStats';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Breadcrumb from '@/components/Breadcrumb';
import KeyDates from '@/components/KeyDates';
import KeyDateDialog from '@/components/KeyDateDialog';
import { KeyDate } from '@/types/activity';

const ActivityView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = userDetails?.role === 'admin';
  
  const [isKeyDateDialogOpen, setIsKeyDateDialogOpen] = useState(false);
  const [currentKeyDate, setCurrentKeyDate] = useState<KeyDate | undefined>(undefined);

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

  const updateKeyDatesMutation = useMutation({
    mutationFn: (keyDates: KeyDate[]) => updateKeyDates(id!, keyDates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast({
        title: "Success",
        description: "Key dates updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating key dates:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update key dates",
        variant: "destructive",
      });
    }
  });

  const handleOpenAddKeyDate = () => {
    setCurrentKeyDate(undefined);
    setIsKeyDateDialogOpen(true);
  };

  const handleOpenEditKeyDate = (keyDate: KeyDate) => {
    setCurrentKeyDate(keyDate);
    setIsKeyDateDialogOpen(true);
  };

  const handleDeleteKeyDate = (keyDateId: string) => {
    if (!activity || !activity.keyDates) return;
    
    const updatedKeyDates = activity.keyDates.filter(kd => kd.id !== keyDateId);
    updateKeyDatesMutation.mutate(updatedKeyDates);
  };

  const handleSaveKeyDate = (keyDateData: Omit<KeyDate, 'id' | 'activityId'>) => {
    if (!activity) return;
    
    const keyDates = activity.keyDates || [];
    
    if (currentKeyDate) {
      // Editing existing key date
      const updatedKeyDates = keyDates.map(kd => 
        kd.id === currentKeyDate.id 
          ? { ...kd, ...keyDateData } 
          : kd
      );
      updateKeyDatesMutation.mutate(updatedKeyDates);
    } else {
      // Adding new key date
      const newKeyDate: KeyDate = {
        id: `kd-${Date.now()}`,
        activityId: id!,
        ...keyDateData
      };
      updateKeyDatesMutation.mutate([...keyDates, newKeyDate]);
    }
  };

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
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
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
        
        <div className="mb-8">
          <KeyDates 
            keyDates={activity.keyDates || []}
            isEditable={isAdmin}
            onAddKeyDate={handleOpenAddKeyDate}
            onEditKeyDate={handleOpenEditKeyDate}
            onDeleteKeyDate={handleDeleteKeyDate}
          />
        </div>
        
        <KeyDateDialog 
          isOpen={isKeyDateDialogOpen}
          onClose={() => setIsKeyDateDialogOpen(false)}
          onSave={handleSaveKeyDate}
          keyDate={currentKeyDate}
        />
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
