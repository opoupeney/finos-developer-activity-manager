
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createAmbassador } from '../services/ambassadorService';
import AmbassadorForm from '../components/Ambassador/AmbassadorForm';
import { Ambassador } from '../types/ambassador';
import FinosHeader from '../components/FinosHeader';
import Breadcrumb from '../components/Breadcrumb';

const AmbassadorCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Ambassador, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createAmbassador(data);
      toast({
        title: "Success",
        description: "Ambassador created successfully",
      });
      navigate('/ambassadors');
    } catch (error: any) {
      console.error("Error creating ambassador:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ambassador",
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
            Create New Ambassador
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new ambassador to the platform
          </p>
        </div>
        
        <AmbassadorForm 
          onSubmit={handleSubmit}
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

export default AmbassadorCreate;
