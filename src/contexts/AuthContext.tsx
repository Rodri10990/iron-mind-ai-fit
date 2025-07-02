
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state listener');
    console.log('AuthProvider: Current URL:', window.location.href);
    console.log('AuthProvider: User agent:', navigator.userAgent);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        console.log('Auth event details:', { event, session: session ? 'present' : 'null' });
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Clear any previous auth errors on successful auth
        if (session) {
          setAuthError(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: Initial session check', { 
        session: session ? 'present' : 'null', 
        error: error?.message 
      });
      
      if (error) {
        console.error('AuthProvider: Error getting initial session:', error);
        setAuthError(error.message);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('AuthProvider: Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      setAuthError(error.message);
    } else {
      console.log('AuthProvider: Successfully signed out');
      setAuthError(null);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
