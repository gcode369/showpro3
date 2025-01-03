import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { User } from '../types/user';
import type { Agent } from '../types/agent';

type AuthStore = {
  user: (User & Partial<Agent>) | null;
  isAuthenticated: boolean;
  setUser: (user: (User & Partial<Agent>) | null) => void;
  updateUser: (updates: Partial<Agent>) => void;
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
      set({ 
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          role: session.user.user_metadata.role || 'client'
        },
        isAuthenticated: true
      });
    }
  }
}));

// Initialize auth state
useAuthStore.getState().initialize();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({
      user: {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata.name || '',
        role: session.user.user_metadata.role || 'client'
      },
      isAuthenticated: true
    });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});