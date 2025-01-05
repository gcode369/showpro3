import { supabase } from '../supabase';
import { registerUser } from './registration';
import type { AuthUser, UserRegistrationData } from '../../types/auth';

export class AuthService {
  async register(email: string, password: string, userData: UserRegistrationData) {
    try {
      // Ensure email and password from params match userData
      const registrationData: UserRegistrationData = {
        ...userData,
        email, // Use email from params
        password // Use password from params
      };

      const result = await registerUser(registrationData);
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }

  async login(email: string, password: string): Promise<{ session: any; user: AuthUser }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.session?.user) throw new Error('Login failed - no session created');

      const userRole = data.session.user.user_metadata.role || 'client';
      const profileTable = userRole === 'agent' ? 'agent_profiles' : 'client_profiles';

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from(profileTable)
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      const user: AuthUser = {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: profile.name,
        role: userRole,
        subscriptionStatus: profile.subscription_status || 'trial',
        subscriptionTier: profile.subscription_tier || 'basic'
      };

      return { session: data.session, user };
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