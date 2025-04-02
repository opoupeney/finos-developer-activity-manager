import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FinosHeader from '../components/FinosHeader';
import EventForm from '../components/EventForm';
import { getActivityByID, updateActivity, deleteActivity } from '../services/activityService';
import { Activity, KeyDate } from '../types/activity';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '../components/Breadcrumb';
import KeyDates from '@/components/KeyDates';
import KeyDateDialog from '@/components/KeyDateDialog';

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isKeyDateDialogOpen, setIsKeyDateDialogOpen] = useState(false);
  const [currentKeyDate, setCurrentKeyDate] = useState<KeyDate | undefined>(undefined);
  const [keyDates, setKeyDates] = useState<KeyDate[]>([]);
  
  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit developer activities",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getActivityByID(id!),
    enabled: !!id,
    onSettled: (data: Activity | undefined) => {
      console.log("Query settled with data:", data);
      if (data && data.keyDates) {
        console.log("Setting key dates:", data.keyDates);
        setKeyDates(data.keyDates);
      }
    }
  });

  useEffect(() => {
    if (event) {
      console.log("Event data loaded:", event);
      console.log("Marketing description:", event.marketingDescription);
    }
  }, [event]);

  const handleSubmit = async (data: Activity) => {
    try {
      console.log("EventEdit handleSubmit called with data:", data);
      
      const updatedActivity = {
        ...data,
        keyDates
      };
      
      await updateActivity(updatedActivity);
      toast({
        title: "Success",
        description: "Developer activity updated successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error updating developer activity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update developer activity",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      toast({
        title: "Deleting...",
        description: "Removing developer activity and all related data",
      });
      
      await deleteActivity(id);
      
      toast({
        title: "Success",
        description: "Developer activity and all related data deleted successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error deleting developer activity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete developer activity",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleOpenAddKeyDate = () => {
    setCurrentKeyDate(undefined);
    setIsKeyDateDialogOpen(true);
  };

  const handleOpenEditKeyDate = (keyDate: KeyDate) => {
    setCurrentKeyDate(keyDate);
    setIsKeyDateDialogOpen(true);
  };

  const handleDeleteKeyDate = (keyDateId: string) => {
    setKeyDates(prevKeyDates => prevKeyDates.filter(kd => kd.id !== keyDateId));
    toast({
      title: "Key date removed",
      description: "The key date has been removed from this activity.",
    });
  };

  const handleSaveKeyDate = (keyDateData: Omit<KeyDate, 'id' | 'activityId'>) => {
    if (currentKeyDate) {
      setKeyDates(prevKeyDates => 
        prevKeyDates.map(kd => 
          kd.id === currentKeyDate.id 
            ? { ...kd, ...keyDateData } 
            : kd
        )
      );
      toast({
        title: "Key date updated",
        description: "The key date has been successfully updated.",
      });
    } else {
      const newKeyDate: KeyDate = {
        id: `kd-${Date.now()}`,
        activityId: id!,
        ...keyDateData
      };
      setKeyDates(prevKeyDates => [...prevKeyDates, newKeyDate]);
      toast({
        title: "Key date added",
        description: "A new key date has been added to this activity.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading developer activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500">Developer Activity not found</h2>
            <p className="text-muted-foreground mt-2">Could not load developer activity information</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("Event in EventEdit render:", event);
  console.log("Event description in render:", event.marketingDescription);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Edit Developer Activity
          </h1>
          <p className="text-muted-foreground mt-1">
            Make changes to the developer activity "{event.title}"
          </p>
        </div>
        
        <EventForm 
          initialData={event} 
          onSubmit={handleSubmit} 
          onDelete={handleDelete}
          isEditing={true}
        />
        
        <div className="mt-8">
          <KeyDates 
            keyDates={keyDates}
            isEditable={true}
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

export default EventEdit;
