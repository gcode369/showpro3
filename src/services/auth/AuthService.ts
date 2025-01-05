import { supabase } from '../supabase';
import { registerUser } from './registration';
import { mapSessionToAuthSession } from './sessionMapper';
import type { AuthUser, UserRegistrationData, AuthResponse } from '../../types/auth';

export class AuthService {
  async register(email: string, password: string, userData: UserRegistrationData) {
    try {
      const registrationData: UserRegistrationData = {
        ...userData,
        email,
        password
      };

      return await registerUser(registrationData);
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.session?.user) throw new Error('Login failed - no session created');

      const session = mapSessionToAuthSession(data.session);
      const userRole = session.user.user_metadata.role;
      const profileTable = userRole === 'agent' ? 'agent_profiles' : 'client_profiles';

      // Get user profile
      const { data: profile } = await supabase
        .from(profileTable)
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // Create user object
      const user: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        name: profile?.name || session.user.user_metadata.name,
        role: userRole,
        subscriptionStatus: profile?.subscription_status || 'trial',
        subscriptionTier: profile?.subscription_tier || 'basic'
      };

      return { session, user };
    } catch (err) {
      console.error('Login error:', err);
      throw err instanceof Error ? err : new Error('Login failed');
    }
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

export const authService = new AuthService();