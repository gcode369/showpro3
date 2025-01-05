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
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.error('Logout error:', err);
    }
  },
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const userRole = session.user.user_metadata.role;
      const profileTable = userRole === 'agent' ? 'agent_profiles' : 'client_profiles';

      const { data: profile } = await supabase
        .from(profileTable)
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      set({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata.name || '',
          role: userRole,
          subscriptionStatus: profile?.subscription_status || 'trial',
          subscriptionTier: profile?.subscription_tier || 'basic'
        },
        isAuthenticated: true
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      set({ user: null, isAuthenticated: false });
    }
  }
}));

// Initialize auth state
useAuthStore.getState().initialize();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const userRole = session.user.user_metadata.role;
    const profileTable = userRole === 'agent' ? 'agent_profiles' : 'client_profiles';

    try {
      const { data: profile } = await supabase
        .from(profileTable)
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      useAuthStore.setState({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.user_metadata.name || '',
          role: userRole,
          subscriptionStatus: profile?.subscription_status || 'trial',
          subscriptionTier: profile?.subscription_tier || 'basic'
        },
        isAuthenticated: true
      });
    } catch (err) {
      console.error('Auth state change error:', err);
    }
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});