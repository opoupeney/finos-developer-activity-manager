
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
    // Handle OAuth redirects and session recovery
    const handleAuthSession = async () => {
      try {
        setAuthLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          throw error;
        }
        
        // If we have a valid session, show success and redirect
        if (session) {
          console.log("Valid session found after redirect:", session.user.id);
          
          toast({
            title: "Signed in successfully",
            description: session.user.app_metadata.provider === 'google' 
              ? "You have been signed in with Google" 
              : "You have been signed in successfully",
          });
          
          navigate('/', { replace: true });
        }
      } catch (error: any) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setAuthLoading(false);
      }
    };
    
    // Improved detection of OAuth redirects
    const hasHashParams = window.location.hash && (
      window.location.hash.includes('access_token') || 
      window.location.hash.includes('error')
    );
    
    const hasQueryParams = window.location.search && (
      window.location.search.includes('error_description') || 
      window.location.search.includes('code=')
    );
    
    // Only try to handle the session if:
    // 1. We're not already loading auth state
    // 2. We don't already have a user
    // 3. We have either hash or query params indicating we're in a redirect flow
    if (!loading && !user && (hasHashParams || hasQueryParams)) {
      console.log("Detected auth redirect, handling session");
      handleAuthSession();
    }
  }, [loading, user, navigate, toast]);
  
  // If the user is already logged in, redirect to home
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
