
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FinosHeader from '../components/FinosHeader';
import EventForm from '../components/EventForm';
import { getMasterclassByID, updateMasterclass, deleteMasterclass } from '../services/masterclassService';
import { Masterclass } from '../types/masterclass';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit developer events",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getMasterclassByID(id!),
    enabled: !!id,
    meta: {
      onError: (err: any) => {
        console.error("Error loading developer event data:", err);
        toast({
          title: "Error loading data",
          description: err.message || "There was a problem retrieving the developer event information",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  });

  const handleSubmit = async (data: Masterclass) => {
    try {
      await updateMasterclass(data);
      toast({
        title: "Success",
        description: "Developer event updated successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error updating developer event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update developer event",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteMasterclass(id);
      toast({
        title: "Success",
        description: "Developer event deleted successfully",
      });
      navigate('/');
    } catch (error: any) {
      console.error("Error deleting developer event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete developer event",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading developer event data...</p>
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
            <h2 className="text-2xl font-bold text-red-500">Developer Event not found</h2>
            <p className="text-muted-foreground mt-2">Could not load developer event information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Edit Developer Event
          </h1>
          <p className="text-muted-foreground mt-1">
            Make changes to the developer event "{event.title}"
          </p>
        </div>
        
        <EventForm 
          initialData={event} 
          onSubmit={handleSubmit} 
          onDelete={handleDelete}
          isEditing={true}
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
