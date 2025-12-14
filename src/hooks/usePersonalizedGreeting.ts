import { useMemo, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { User } from '@supabase/supabase-js';

type SupportedRole = 'buyer' | 'supplier' | 'admin' | 'support';

interface UsePersonalizedGreetingOptions {
  role?: SupportedRole;
  visitCountKey?: string;
}

export function usePersonalizedGreeting(
  user: User | null | undefined,
  options: UsePersonalizedGreetingOptions = {}
) {
  const { role = 'buyer', visitCountKey = 'dashboard_visit_count' } = options;
  const initialFirstName =
    user?.user_metadata?.full_name?.split(' ')[0] || null;
  const [userFirstName, setUserFirstName] = useState<string | null>(initialFirstName);
  const [isNameLoaded, setIsNameLoaded] = useState<boolean>(!!initialFirstName);

  // Fetch user's first name from metadata or profile
  useEffect(() => {
    let isMounted = true;

    const fetchUserNameFromDatabase = async () => {
      if (!user?.id) {
        if (isMounted) {
          setUserFirstName(null); // Use null instead of 'there'
          setIsNameLoaded(true);
        }
        return;
      }

      // Always fetch from database to get the latest value
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (isMounted) {
          if (profile?.full_name) {
            const firstName = profile.full_name.split(' ')[0]?.trim();
            setUserFirstName(firstName || null); // Use null if empty
          } else {
            setUserFirstName(null); // Use null instead of 'there'
          }
          setIsNameLoaded(true);
        }
      } catch (error) {
        logger.error('Error fetching user name', { error });
        if (isMounted) {
          setUserFirstName(null); // Use null instead of 'there'
          setIsNameLoaded(true);
        }
      }
    };

    const fetchUserName = async () => {
      if (!user?.id) {
        if (isMounted) {
          setUserFirstName(null); // Use null instead of 'there'
          setIsNameLoaded(true);
        }
        return;
      }

      // Check metadata first (synchronous) for initial load
      const metadataName = user.user_metadata?.full_name;
      if (metadataName) {
        const firstName = metadataName.split(' ')[0]?.trim();
        if (isMounted) {
          setUserFirstName(firstName || null); // Use null if empty
          setIsNameLoaded(true);
        }
        // Still fetch from database in background to ensure we have the latest
        fetchUserNameFromDatabase();
        return;
      }

      // If no metadata, fetch from profile (async)
      await fetchUserNameFromDatabase();
    };

    fetchUserName();

    // Listen for profile updates to refresh the name
    // When profile is updated, always fetch from database (bypass metadata check)
    const handleProfileUpdate = (event: CustomEvent) => {
      const { userId } = event.detail;
      // If this update is for the current user, refetch their name from database
      if (userId === user?.id) {
        fetchUserNameFromDatabase();
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate as EventListener);

    return () => {
      isMounted = false;
      window.removeEventListener('profile-updated', handleProfileUpdate as EventListener);
    };
  }, [user?.id, user?.user_metadata?.full_name]);

  // Greeting templates - time-based only for consistency
  // Removed random selection to ensure greeting is stable during a session
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    
    // Use only time-based greetings for consistency
    // Greeting is calculated once per mount and remains stable
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }, []); // Empty deps - only calculate once per mount

  return {
    greeting,
    userFirstName: userFirstName || 'there',
    isNameLoaded,
  };
}

