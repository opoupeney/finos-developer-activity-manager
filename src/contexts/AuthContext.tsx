
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
      // Configure signOut to remove persistent sessions
      await supabase.auth.signOut({ scope: 'global' });
      // Clear local state
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      // Store a flag in localStorage to indicate signed out state for page refreshes
      localStorage.setItem('authSignedOut', 'true');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url, role')
        .eq('id', userId)
        .single();

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
    // Check if user has manually signed out before
    const hasSignedOut = localStorage.getItem('authSignedOut') === 'true';
    
    if (hasSignedOut) {
      // If previously signed out, ensure we clear any lingering session
      supabase.auth.signOut({ scope: 'global' })
        .then(() => {
          localStorage.removeItem('authSignedOut');
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
        
        console.log('Initial session fetch:', currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const details = await fetchUserDetails(currentSession.user.id);
          setUserDetails(details);
        }
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
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
      console.log('Auth state changed:', event, newSession?.user?.id);
      
      // Set loading to true at the start of auth state change
      setLoading(true);
      
      if (event === 'SIGNED_OUT') {
        // Make sure we clear everything on sign out
        setSession(null);
        setUser(null);
        setUserDetails(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
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
