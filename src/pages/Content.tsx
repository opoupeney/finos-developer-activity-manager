
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchContents } from '@/services/contentService';
import FinosHeader from '@/components/FinosHeader';
import ContentHeader from '@/components/Content/ContentHeader';
import ContentGrid from '@/components/Content/ContentGrid';
import Breadcrumb from '@/components/Breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

const Content = () => {
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  const { data: contents, isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: fetchContents,
  });

  const breadcrumbItems = [
    { label: 'Content Library', href: '/content', current: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <ContentHeader isAdmin={isAdmin} />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive">Error loading content</h2>
            <p className="text-muted-foreground mt-2">There was a problem loading the content library.</p>
          </div>
        ) : (
          <ContentGrid contents={contents || []} isAdmin={isAdmin} />
        )}
      </main>
    </div>
  );
};

export default Content;
