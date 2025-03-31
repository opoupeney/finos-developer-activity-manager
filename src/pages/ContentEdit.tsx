import React from 'react';
import FinosHeader from '../components/FinosHeader';
import ContentForm from '../components/ContentForm';
import { updateContent, getContent } from '../services/contentService';
import { Content } from '../types/content';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '../components/Breadcrumb';

const ContentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = React.useState<Content | null>(null);
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (userDetails && userDetails.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit content",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [userDetails, navigate, toast]);
  
  React.useEffect(() => {
    const fetchContent = async () => {
      if (id) {
        try {
          const fetchedContent = await getContent(id);
          setContent(fetchedContent);
        } catch (error) {
          console.error("Error fetching content:", error);
          toast({
            title: "Error",
            description: "Failed to load content for editing",
            variant: "destructive",
          });
          navigate('/content');
        }
      }
    };

    fetchContent();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: Content) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Content ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateContent(id, data);
      toast({
        title: "Content Updated",
        description: "Content has been updated successfully",
      });
      navigate('/content');
    } catch (error) {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    // Implement delete functionality here if needed
  };

  if (!content) {
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
              Loading Content...
            </h1>
            <p className="text-muted-foreground mt-1">
              Please wait while we fetch the content for editing.
            </p>
          </div>
        </main>
      </div>
    );
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
            Edit Content
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit the content using the form below.
          </p>
        </div>
        
        <ContentForm
          initialData={content}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isEditing={true}
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

export default ContentEdit;
