import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type UserRole = "admin" | "supplier" | "buyer" | "support";

interface UseAuthReturn {
  user: User | null;
  roles: UserRole[];
  hasRole: (role: UserRole) => boolean;
  loading: boolean;
  sessionChecked: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setSessionChecked(true);

      // Fetch user roles if authenticated
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setRoles([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    if (!supabase) return;

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    // Check user subscription to determine if buyer or supplier
    const { data: subData } = await supabase
      .from('user_subscriptions')
      .select('tier:subscription_tiers(user_type)')
      .eq('user_id', userId)
      .single();

    const userRoles: UserRole[] = [];

    if (adminData) {
      userRoles.push('admin');
    }

    if (subData?.tier) {
      const tierData = subData.tier as any;
      if (tierData.user_type === 'buyer') {
        userRoles.push('buyer');
      } else if (tierData.user_type === 'supplier') {
        userRoles.push('supplier');
      }
    }

    setRoles(userRoles);
  };

  const hasRole = (role: UserRole) => {
    return roles.includes(role);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setRoles([]);
  };

  return {
    user,
    roles,
    hasRole,
    loading,
    sessionChecked,
    signOut,
  };
}
