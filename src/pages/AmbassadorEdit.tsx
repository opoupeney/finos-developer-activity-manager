
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAmbassadorById, updateAmbassador } from '@/services/ambassadorService';
import { useToast } from '@/hooks/use-toast';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import AmbassadorForm from '@/components/Ambassador/AmbassadorForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

const AmbassadorEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (userDetails && !isAdmin) {
      navigate('/ambassadors');
    }
  }, [userDetails, isAdmin, navigate]);

  const { data: ambassador, isLoading, error } = useQuery({
    queryKey: ['ambassador', id],
    queryFn: () => fetchAmbassadorById(id as string),
    enabled: !!id && isAdmin,
  });

  const breadcrumbItems = ambassador ? [
    { label: 'Ambassadors', href: '/ambassadors' },
    { label: `${ambassador.first_name} ${ambassador.last_name}`, href: `/ambassadors/${id}` },
    { label: 'Edit', href: '' },
  ] : [
    { label: 'Ambassadors', href: '/ambassadors' },
    { label: 'Edit Ambassador', href: '' },
  ];

  const updateAmbassadorMutation = useMutation({
    mutationFn: (data: FormValues) => updateAmbassador(id as string, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ambassador was successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['ambassador', id] });
      queryClient.invalidateQueries({ queryKey: ['ambassadors'] });
      navigate(`/ambassadors/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ambassador.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: FormValues) => {
    updateAmbassadorMutation.mutate(data);
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
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive">Error loading ambassador</h2>
            <p className="text-muted-foreground mt-2">There was a problem loading this ambassador's information.</p>
          </div>
        ) : ambassador ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Ambassador: {ambassador.first_name} {ambassador.last_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <AmbassadorForm 
                initialData={ambassador}
                onSubmit={handleSubmit} 
                isSubmitting={updateAmbassadorMutation.isPending} 
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-muted-foreground">Ambassador not found</h2>
            <p className="text-muted-foreground mt-2">The requested ambassador does not exist.</p>
          </div>
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default AmbassadorEdit;
