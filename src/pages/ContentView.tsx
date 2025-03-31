import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FinosHeader from '../components/FinosHeader';
import Breadcrumb from '../components/Breadcrumb';
import { fetchContentById } from '../services/contentService'; 
import { Content } from '@/types/content';
import ContentDetail from '../components/Content/ContentDetail';

const ContentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (id) {
          const contentData = await fetchContentById(id);
          setContent(contentData);
        } else {
          setError('Content ID is missing.');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load content.');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id]);

  if (isLoading) {
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
              Please wait while we fetch the content details.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-destructive">
              Error Loading Content
            </h1>
            <p className="text-muted-foreground mt-1">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

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
              Content Not Found
            </h1>
            <p className="text-muted-foreground mt-1">
              The requested content could not be found.
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
            {content.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            View the details of the content below.
          </p>
        </div>
        <ContentDetail content={content} />
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

export default ContentView;
