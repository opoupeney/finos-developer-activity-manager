
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { createContent } from '@/services/contentService';
import { useToast } from '@/hooks/use-toast';
import FinosHeader from '@/components/FinosHeader';
import Breadcrumb from '@/components/Breadcrumb';
import ContentForm from '@/components/Content/ContentForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const ContentCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.role === 'admin';
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/content');
    return null;
  }

  const breadcrumbItems = [
    { label: 'Content', link: '/content' },
    { label: 'Create New Content', link: '' },
  ];

  const createContentMutation = useMutation({
    mutationFn: (data: FormValues) => createContent(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Content was successfully created.',
      });
      navigate('/content');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create content.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: FormValues) => {
    createContentMutation.mutate(data);
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
          
          <Card>
            <CardHeader>
              <CardTitle>Create New Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentForm 
                onSubmit={handleSubmit} 
                isSubmitting={createContentMutation.isPending} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContentCreate;
