
import React, { useEffect, useState } from 'react';
import FinosHeader from '../components/FinosHeader';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/Breadcrumb';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [authLoading, setAuthLoading] = useState(false);
  
  useEffect(() => {
    // Check URL for redirects from external OAuth providers
    const checkForExternalAuth = async () => {
      // Check if this might be a redirect from external auth provider
      const hasHash = window.location.hash && window.location.hash.length > 0;
      
      if (hasHash) {
        console.log("Detected potential OAuth redirect with hash params");
        try {
          setAuthLoading(true);
          
          // This will attempt to exchange the auth code for a session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            toast({
              title: "Signed in successfully",
              description: "You have been authenticated",
            });
            
            // Clear the hash to prevent repeated processing
            window.history.replaceState(null, '', window.location.pathname);
            
            navigate('/', { replace: true });
          }
        } catch (error: any) {
          console.error("Error processing OAuth redirect:", error);
          toast({
            title: "Authentication Error",
            description: error.message || "Failed to complete authentication",
            variant: "destructive",
          });
        } finally {
          setAuthLoading(false);
        }
      }
    };
    
    // Handle OAuth redirects, password resets, and session recovery
    const handleAuthSession = async () => {
      // Skip if already processing external auth
      if (authLoading) return;
      
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
          
          // Check if this is a password reset flow
          const urlParams = new URLSearchParams(window.location.search);
          const isReset = urlParams.get('type') === 'recovery';
          
          if (isReset) {
            toast({
              title: "Password Reset",
              description: "You can now set a new password",
            });
            
            // Optionally redirect to a password reset form
            // navigate('/reset-password', { replace: true });
            // For now, we'll just redirect to home
            navigate('/', { replace: true });
          } else {
            toast({
              title: "Signed in successfully",
              description: session.user.app_metadata.provider === 'google' 
                ? "You have been signed in with Google" 
                : "You have been signed in successfully",
            });
            
            navigate('/', { replace: true });
          }
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
    
    // Improved detection of OAuth redirects and password reset
    const hasHashParams = window.location.hash && (
      window.location.hash.includes('access_token') || 
      window.location.hash.includes('error')
    );
    
    const hasQueryParams = window.location.search && (
      window.location.search.includes('error_description') || 
      window.location.search.includes('code=') ||
      window.location.search.includes('type=recovery')
    );
    
    // First check for external auth (OAuth redirects)
    if (hasHashParams) {
      checkForExternalAuth();
    } 
    // Then check for other auth flows (password reset, etc.)
    else if (!loading && !user && hasQueryParams) {
      console.log("Detected auth redirect or password reset, handling session");
      handleAuthSession();
    }
  }, [loading, user, navigate, toast, authLoading]);
  
  // If the user is already logged in, redirect to home
  if (user && !loading && !authLoading) {
    // If there's a from location in state, redirect there instead of home
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
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
