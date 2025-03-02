'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User as SupabaseUser } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'school_owner' | 'admin';
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Map Supabase user to our User type
  const mapUser = (supabaseUser: SupabaseUser | null): User => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || '',
      // Default to 'user' role, but this could be fetched from user_metadata or a separate profiles table
      role: (supabaseUser.user_metadata?.role as 'user' | 'school_owner' | 'admin') || 'user',
    };
  };

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(mapUser(session?.user || null));
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user || null));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setUser(mapUser(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'user',
          },
        }
      });
      
      if (error) throw error;
      
      // Note: User might need to confirm email before they're fully registered
      setUser(mapUser(data.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      // The redirect will happen automatically, handled by Supabase
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
