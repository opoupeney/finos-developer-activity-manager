
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAmbassadorById } from '@/services/ambassadorService';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import AmbassadorDetail from '@/components/Ambassador/AmbassadorDetail';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';

const AmbassadorView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  const { data: ambassador, isLoading, error } = useQuery({
    queryKey: ['ambassador', id],
    queryFn: () => fetchAmbassadorById(id as string),
    enabled: !!id,
  });

  const breadcrumbItems = ambassador ? [
    { label: 'Ambassadors', href: '/ambassadors' },
    { label: `${ambassador.first_name} ${ambassador.last_name}`, href: '' },
  ] : [
    { label: 'Ambassadors', href: '/ambassadors' },
    { label: 'Ambassador Details', href: '' },
  ];

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
          <AmbassadorDetail ambassador={ambassador} isAdmin={isAdmin} />
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

export default AmbassadorView;
