
import React, { useState, useEffect } from 'react';
import { getMasterclassData } from '../services/masterclassService';
import { Masterclass } from '../types/masterclass';
import FinosHeader from '../components/FinosHeader';
import MasterclassHeader from '../components/MasterclassHeader';
import MasterclassStats from '../components/MasterclassStats';
import MasterclassDetails from '../components/MasterclassDetails';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [masterclass, setMasterclass] = useState<Masterclass | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        const data = getMasterclassData();
        setMasterclass(data);
        
        toast({
          title: "Data loaded successfully",
          description: "Masterclass information has been retrieved",
        });
      } catch (error) {
        console.error("Error loading masterclass data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem retrieving the masterclass information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12 flex items-center justify-center h-[80vh]">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-finos-blue/30 border-t-finos-blue animate-spin"></div>
            <p className="mt-4 text-muted-foreground animate-pulse">Loading masterclass data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If data is not available
  if (!masterclass) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <FinosHeader />
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500">Data not available</h2>
            <p className="text-muted-foreground mt-2">Could not load masterclass information</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <MasterclassHeader masterclass={masterclass} />
        
        <MasterclassStats masterclass={masterclass} />
        
        <MasterclassDetails masterclass={masterclass} />
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

export default Index;
