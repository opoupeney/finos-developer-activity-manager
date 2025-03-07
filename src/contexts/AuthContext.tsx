
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userDetails: { full_name?: string; email?: string; avatar_url?: string; role?: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  userDetails: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<{ full_name?: string; email?: string; avatar_url?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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

    const fetchSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        const details = await fetchUserDetails(newSession.user.id);
        setUserDetails(details);
      } else {
        setUserDetails(null);
      }
      
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
