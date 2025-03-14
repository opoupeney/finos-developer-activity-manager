
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { createAmbassador } from '@/services/ambassadorService';
import { useToast } from '@/hooks/use-toast';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import AmbassadorForm from '@/components/Ambassador/AmbassadorForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';

interface FormValues {
  first_name: string;
  last_name: string;
  location: string | null;
  linkedin_profile: string | null;
  github_id: string | null;
  company: string | null;
  title: string | null;
  bio: string | null;
}

const AmbassadorCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (userDetails && !isAdmin) {
      navigate('/ambassadors');
    }
  }, [userDetails, isAdmin, navigate]);

  const breadcrumbItems = [
    { label: 'Ambassadors', href: '/ambassadors' },
    { label: 'Create New Ambassador', href: '' },
  ];

  const createAmbassadorMutation = useMutation({
    mutationFn: (data: FormValues) => createAmbassador(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ambassador was successfully created.',
      });
      navigate('/ambassadors');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ambassador.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: FormValues) => {
    createAmbassadorMutation.mutate(data);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Ambassador</CardTitle>
          </CardHeader>
          <CardContent>
            <AmbassadorForm 
              onSubmit={handleSubmit} 
              isSubmitting={createAmbassadorMutation.isPending} 
            />
          </CardContent>
        </Card>
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default AmbassadorCreate;
