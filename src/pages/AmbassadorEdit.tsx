
import React from 'react';
import FinosHeader from '../components/FinosHeader';
import AmbassadorForm from '../components/Ambassador/AmbassadorForm';
import { fetchAmbassadorById as getAmbassador, updateAmbassador } from '../services/ambassadorService';
import { Ambassador } from '../types/ambassador';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

const AmbassadorEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [ambassador, setAmbassador] = React.useState<Ambassador | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();

  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit ambassadors",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  React.useEffect(() => {
    if (id) {
      fetchAmbassador(id);
    }
  }, [id]);

  const fetchAmbassador = async (id: string) => {
    try {
      const ambassadorData = await getAmbassador(id);
      setAmbassador(ambassadorData);
    } catch (error) {
      console.error("Error fetching ambassador:", error);
      toast({
        title: "Error",
        description: "Failed to fetch ambassador",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: Ambassador) => {
    try {
      if (id) {
        await updateAmbassador(id, data);
        toast({
          title: "Ambassador Updated",
          description: "Ambassador has been updated successfully",
        });
        navigate('/ambassadors');
      } else {
        toast({
          title: "Error",
          description: "Ambassador ID is missing",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating ambassador:", error);
      toast({
        title: "Error",
        description: "Failed to update ambassador",
        variant: "destructive",
      });
    }
  };

  if (!ambassador) {
    return <div>Loading...</div>;
  }

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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Edit Ambassador
          </h1>
          <p className="text-muted-foreground mt-1">
            Update the details of the ambassador
          </p>
        </div>
        <AmbassadorForm 
          initialData={ambassador} 
          onSubmit={handleSubmit} 
          isSubmitting={false} 
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

export default AmbassadorEdit;
