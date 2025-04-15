
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
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Set up auth state change listener first
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, changedSession) => {
          console.log('Auth state changed:', event, changedSession?.user?.id);
          
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setUserDetails(null);
          } else if (changedSession) {
            setSession(changedSession);
            setUser(changedSession.user);
            
            // For events that include a user, fetch user details 
            if (changedSession.user) {
              const details = await fetchUserDetails(changedSession.user.id);
              setUserDetails(details);
            }
          }
        });

        // Then check for existing session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        // If we have a session, set up the auth state
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          const details = await fetchUserDetails(initialSession.user.id);
          setUserDetails(details);
        }

        return () => {
          if (authListener?.subscription) {
            console.log('Cleaning up auth listener');
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        toast({
          title: 'Authentication Error',
          description: 'There was a problem with authentication. Please try signing in again.',
          variant: 'destructive',
        });
        
        // Clear auth state on error
        setSession(null);
        setUser(null);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      cleanup.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
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
