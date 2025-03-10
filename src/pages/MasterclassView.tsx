
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMasterclassByID } from '../services/masterclassService';
import FinosHeader from '../components/FinosHeader';
import MasterclassHeader from '../components/MasterclassHeader';
import MasterclassStats from '../components/MasterclassStats';
import MasterclassDetails from '../components/MasterclassDetails';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const MasterclassView = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getMasterclassByID(id!),
    enabled: !!id,
    meta: {
      onSuccess: () => {
        toast({
          title: "Data loaded successfully",
          description: "Developer event information has been retrieved",
        });
      },
      onError: (err: any) => {
        console.error("Error loading developer event data:", err);
        toast({
          title: "Error loading data",
          description: err.message || "There was a problem retrieving the developer event information",
          variant: "destructive",
        });
      }
    }
  });

  // Loading state
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

  // If data is not available
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
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <MasterclassHeader masterclass={event} />
          </div>
          
          {userDetails?.role === 'admin' && (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to={`/edit/${event.id}`}>
                <Edit className="h-4 w-4" />
                Edit Event
              </Link>
            </Button>
          )}
        </div>
        
        <MasterclassStats masterclass={event} />
        
        <div className="mt-8">
          <MasterclassDetails masterclass={event} />
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

export default MasterclassView;
