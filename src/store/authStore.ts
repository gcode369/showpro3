import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { AuthUser } from '../types/auth';

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from(session.user.user_metadata.role === 'agent' ? 'agent_profiles' : 'client_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            role: session.user.user_metadata.role,
            subscriptionStatus: profile.subscription_status,
            subscriptionTier: profile.subscription_tier
          },
          isAuthenticated: true
        });
      }
    }
  }
}));

// Initialize auth state
useAuthStore.getState().initialize();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const { data: profile } = await supabase
      .from(session.user.user_metadata.role === 'agent' ? 'agent_profiles' : 'client_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profile) {
      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: profile.name,
          role: session.user.user_metadata.role,
          subscriptionStatus: profile.subscription_status,
          subscriptionTier: profile.subscription_tier
        },
        isAuthenticated: true
      });
    }
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});