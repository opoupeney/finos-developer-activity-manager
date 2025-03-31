
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAmbassadorById } from '../services/ambassadorService';
import { Ambassador } from '@/types/ambassador';
import FinosHeader from '../components/FinosHeader';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '@/hooks/use-toast';

const AmbassadorView = () => {
  const { id } = useParams<{ id: string }>();
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getAmbassador = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchAmbassadorById(id);
        setAmbassador(data);
      } catch (error) {
        console.error("Failed to fetch ambassador:", error);
        toast({
          title: "Error",
          description: "Failed to load ambassador details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getAmbassador();
  }, [id, toast]);

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
            {loading ? 'Loading Ambassador...' : ambassador ? `${ambassador.first_name} ${ambassador.last_name}` : 'Ambassador Not Found'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Ambassador details
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        ) : ambassador ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {ambassador.headshot_url ? (
                <img 
                  src={ambassador.headshot_url} 
                  alt={`${ambassador.first_name} ${ambassador.last_name}`}
                  className="rounded-lg shadow-md w-full"
                />
              ) : (
                <div className="bg-muted flex items-center justify-center rounded-lg aspect-square">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {ambassador.first_name?.charAt(0)}{ambassador.last_name?.charAt(0)}
                  </span>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {ambassador.company && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                    <p>{ambassador.company}</p>
                  </div>
                )}
                
                {ambassador.title && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                    <p>{ambassador.title}</p>
                  </div>
                )}

                {ambassador.location && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p>{ambassador.location}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Bio</h2>
                  <p className="text-muted-foreground">{ambassador.bio || 'No bio available'}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Connect</h2>
                  <div className="flex flex-wrap gap-3">
                    {ambassador.linkedin_profile && (
                      <a 
                        href={ambassador.linkedin_profile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                      >
                        LinkedIn
                      </a>
                    )}
                    
                    {ambassador.github_id && (
                      <a 
                        href={`https://github.com/${ambassador.github_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ambassador not found or has been removed.</p>
          </div>
        )}
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

export default AmbassadorView;
