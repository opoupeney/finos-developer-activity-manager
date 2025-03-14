
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchContentById } from '@/services/contentService';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ContentDetail from '@/components/Content/ContentDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const ContentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentById(id as string),
    enabled: !!id,
  });

  const breadcrumbItems = [
    { label: 'Content', href: '/content' },
    { label: content?.title || 'Content Details', href: '' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <FinosHeader />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mt-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
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
              <h2 className="text-xl font-semibold text-destructive">Error loading content</h2>
              <p className="text-muted-foreground mt-2">There was a problem loading this content item.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/content">Back to Content Library</Link>
              </Button>
            </div>
          ) : content ? (
            <ContentDetail content={content} isAdmin={isAdmin} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-muted-foreground">Content not found</h2>
              <p className="text-muted-foreground mt-2">The requested content item does not exist.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/content">Back to Content Library</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentView;
