
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userDetails: { full_name?: string; email?: string; avatar_url?: string; role?: string } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  userDetails: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<{ full_name?: string; email?: string; avatar_url?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signOut = async () => {
    try {
      setLoading(true);
      
      // First clear the state before actual signout
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      // Configure signOut to remove persistent sessions
      await supabase.auth.signOut({ scope: 'global' });
      
      // Store a flag in localStorage to indicate signed out state for page refreshes
      localStorage.setItem('authSignedOut', 'true');
      
      // Clear any other auth-related storage
      localStorage.removeItem('supabase.auth.token');
      
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user details:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserDetails:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('AuthProvider init - checking auth state');
    
    // Check if user has manually signed out before
    const hasSignedOut = localStorage.getItem('authSignedOut') === 'true';
    
    if (hasSignedOut) {
      // If previously signed out, ensure we clear any lingering session
      console.log('Previously signed out, clearing session');
      
      // Clear state first to prevent flickering
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      // Then ensure Supabase session is cleared
      supabase.auth.signOut({ scope: 'global' })
        .then(() => {
          localStorage.removeItem('authSignedOut');
          localStorage.removeItem('supabase.auth.token');
          console.log('Cleared persistent session after signout');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error clearing persistent session:', error);
          setLoading(false);
        });
      return;
    }

    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log('Initial session fetch:', currentSession?.user?.id || 'No session');
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (currentSession.user) {
            const details = await fetchUserDetails(currentSession.user.id);
            setUserDetails(details);
          }
        } else {
          // If no current session, ensure state is clear
          setSession(null);
          setUser(null);
          setUserDetails(null);
        }
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
        
        // Clear session state on error
        setSession(null);
        setUser(null);
        setUserDetails(null);
        
        toast({
          title: 'Authentication Error',
          description: 'There was a problem fetching your session.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id || 'No user');
      
      // Set loading to true at the start of auth state change
      setLoading(true);
      
      if (event === 'SIGNED_OUT') {
        // Make sure we clear everything on sign out
        console.log('SIGNED_OUT event detected, clearing auth state');
        setSession(null);
        setUser(null);
        setUserDetails(null);
        localStorage.removeItem('supabase.auth.token');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log(`${event} event detected, updating auth state`);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          const details = await fetchUserDetails(newSession.user.id);
          setUserDetails(details);
        } else {
          setUserDetails(null);
        }
      }
      
      // Set loading to false after processing the auth state change
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    session,
    user,
    userDetails,
    loading,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
