
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchContentById, updateContent } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ContentForm from '@/components/Content/ContentForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentType, ContentProvider, ContentStatus } from '@/types/content';

interface FormValues {
  title: string;
  description: string | null;
  author: string | null;
  url: string | null;
  type: ContentType;
  provider: ContentProvider;
  status: ContentStatus;
}

const ContentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/content');
    return null;
  }

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentById(id as string),
    enabled: !!id,
  });

  const breadcrumbItems = [
    { label: 'Content', link: '/content' },
    { label: content?.title || 'Edit Content', link: `/content/${id}` },
    { label: 'Edit', link: '' },
  ];

  const updateContentMutation = useMutation({
    mutationFn: (data: FormValues) => updateContent(id as string, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Content was successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      navigate(`/content/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update content.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: FormValues) => {
    updateContentMutation.mutate(data);
  };

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
            </div>
          ) : content ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Content: {content.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentForm 
                  initialData={content}
                  onSubmit={handleSubmit} 
                  isSubmitting={updateContentMutation.isPending} 
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-muted-foreground">Content not found</h2>
              <p className="text-muted-foreground mt-2">The requested content item does not exist.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentEdit;
