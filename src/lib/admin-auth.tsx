import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; success: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null; success: boolean }>;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkAdminStatus(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await checkAdminStatus(session.user);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (authUser: User) => {
    try {
      // Check if user email matches admin domain or has admin role
      const email = authUser.email || '';
      const isAdminUser = email.includes('@gurukul.edu.np') || email.includes('@gurukul.com');

      if (isAdminUser || process.env.NODE_ENV === 'development') {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          created_at: authUser.created_at,
        });
        setIsAdmin(true);

        // Log admin session
        await supabase.from('cms_admin_sessions').insert({
          user_id: authUser.id,
          ip_address: 'unknown',
          user_agent: navigator.userAgent,
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Admin check error:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, success: false };
      }

      // Log activity
      if (data.user) {
        await supabase.from('cms_activity_log').insert({
          user_id: data.user.id,
          action: 'login',
          resource_type: 'auth',
          resource_title: email,
        });
      }

      return { error: null, success: true };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    if (user) {
      // Update session record
      await supabase
        .from('cms_admin_sessions')
        .update({ logout_at: new Date().toISOString(), is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Log activity
      await supabase.from('cms_activity_log').insert({
        user_id: user.id,
        action: 'logout',
        resource_type: 'auth',
        resource_title: user.email,
      });
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/main_box/reset-password`,
      });

      return { error, success: !error };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, session, loading, signIn, signOut, resetPassword, isAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
