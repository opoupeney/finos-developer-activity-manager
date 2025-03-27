
import React from 'react';
import FinosHeader from '../components/FinosHeader';
import EventForm from '../components/EventForm';
import { createActivity } from '../services/activityService';
import { Activity } from '../types/activity';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '../components/Breadcrumb';

const EventCreate = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to create developer activities",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  const handleSubmit = async (data: Activity) => {
    try {
      // Remove id property before passing to createActivity to avoid serialization issues
      const { id, ...eventWithoutId } = data;
      await createActivity(eventWithoutId);
      
      toast({
        title: "Activity Created",
        description: "Developer activity has been created successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error creating developer activity:", error);
      
      toast({
        title: "Error",
        description: "Failed to create developer activity",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create New Developer Activity
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create a new developer activity
          </p>
        </div>
        
        <EventForm onSubmit={handleSubmit} />
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

export default EventCreate;
