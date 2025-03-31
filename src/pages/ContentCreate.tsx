
import React, { useState } from 'react';
import FinosHeader from '../components/FinosHeader';
import ContentForm from '../components/Content/ContentForm';
import { createContent } from '../services/contentService';
import { Content } from '../types/content';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '../components/Breadcrumb';

const ContentCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to create content",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log("ContentCreate handleSubmit called with data:", data);
      await createContent(data);
      
      toast({
        title: "Content Created",
        description: "Content has been created successfully",
      });
      
      navigate('/content');
    } catch (error) {
      console.error("Error creating content:", error);
      
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create New Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to create new content
          </p>
        </div>
        
        <ContentForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
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

export default ContentCreate;
