import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { getUserProfile } from '../services/auth/profileService';
import { useLoadingState } from './useLoadingState';

export function useSession() {
  const { setUser, clearUser } = useAuthStore();
  const { startLoading, stopLoading } = useLoadingState();

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        startLoading();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!mounted || !session?.user) {
          stopLoading();
          return;
        }

        const userRole = session.user.user_metadata.role || 'client';
        const profile = await getUserProfile(session.user.id, userRole);

        if (!mounted) return;

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile.name,
          role: userRole,
          subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
          subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
        });
        stopLoading();
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) {
          clearUser();
          stopLoading(err instanceof Error ? err.message : 'Failed to initialize session');
        }
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        clearUser();
      } else if (session?.user) {
        await initSession();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, clearUser, startLoading, stopLoading]);
}