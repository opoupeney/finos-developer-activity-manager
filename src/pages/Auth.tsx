
import React, { useEffect, useState } from 'react';
import FinosHeader from '../components/FinosHeader';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/Breadcrumb';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);
  
  useEffect(() => {
    const handleAuthSession = async () => {
      try {
        setAuthLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        // If there is session data and we detect that it's from an OAuth provider (like Google)
        // show a success toast since we just came back from an OAuth redirect
        if (data.session?.provider_token || data.session?.provider_refresh_token) {
          toast({
            title: "Signed in successfully",
            description: "You have been signed in with Google",
          });
          
          navigate('/', { replace: true });
        }
        
        if (error) {
          console.error("Error checking auth session:", error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Unexpected error during auth check:", error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setAuthLoading(false);
      }
    };
    
    // Check for auth session when the component mounts
    if (!loading && !user) {
      // Look for hash parameters or query parameters which indicate an OAuth callback
      const hasHashParams = window.location.hash && window.location.hash.includes('access_token');
      const hasQueryParams = window.location.search && (
        window.location.search.includes('error_description') || 
        window.location.search.includes('code=')
      );
      
      if (hasHashParams || hasQueryParams) {
        handleAuthSession();
      }
    }
  }, [loading, user, navigate, toast]);
  
  // If already authenticated, redirect to dashboard
  if (user && !loading && !authLoading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <FinosHeader />
      
      <div className="container max-w-7xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to FINOS's Developer Activities Manager</h1>
          <AuthForm />
        </div>
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

export default Auth;
