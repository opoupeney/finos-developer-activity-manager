
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAmbassadors } from '@/services/ambassadorService';
import FinosHeader from '@/components/FinosHeader';
import AmbassadorHeader from '@/components/Ambassador/AmbassadorHeader';
import AmbassadorGrid from '@/components/Ambassador/AmbassadorGrid';
import Breadcrumb from '@/components/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardFooter from '@/components/Dashboard/DashboardFooter';

const Ambassadors = () => {
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  const { data: ambassadors, isLoading, error } = useQuery({
    queryKey: ['ambassadors'],
    queryFn: fetchAmbassadors,
  });

  const breadcrumbItems = [
    { label: 'Ambassadors', href: '/ambassadors', current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <AmbassadorHeader isAdmin={isAdmin} />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive">Error loading ambassadors</h2>
            <p className="text-muted-foreground mt-2">There was a problem loading the ambassadors.</p>
          </div>
        ) : (
          <AmbassadorGrid ambassadors={ambassadors || []} isAdmin={isAdmin} />
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};

export default Ambassadors;
