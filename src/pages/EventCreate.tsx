
import React from 'react';
import FinosHeader from '../components/FinosHeader';
import EventForm from '../components/EventForm';
import { createMasterclass } from '../services/masterclassService';
import { Masterclass } from '../types/masterclass';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EventCreate = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is an admin
  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to create developer events",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  const handleSubmit = async (data: Masterclass) => {
    // Remove id because we're creating a new event
    const { id, ...eventWithoutId } = data;
    try {
      await createMasterclass(eventWithoutId);
    } catch (error) {
      console.error("Error creating developer event:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create New Developer Event
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create a new developer event
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
