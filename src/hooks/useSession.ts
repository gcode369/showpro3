import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { refreshSession } from '../services/auth/sessionManager';
import { getUserProfile } from '../services/auth/profileService';

export function useSession() {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const session = await refreshSession();
        if (!mounted || !session?.user) return;

        const profile = await getUserProfile(
          session.user.id,
          session.user.user_metadata.role
        );

        if (!mounted) return;

        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profile.name,
          role: session.user.user_metadata.role,
          subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
          subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
        });
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) clearUser();
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          clearUser();
        } else if (session?.user) {
          await initSession();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);
}