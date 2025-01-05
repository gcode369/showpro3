import { supabase } from '../supabase';
import { getUserProfile } from './profileService';
import type { AuthUser, UserRegistrationData } from '../../types/auth';
import { registerUser } from './registration';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: AuthUser }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.session?.user) throw new Error('Login failed - no session created');

      const userRole = data.session.user.user_metadata.role || 'client';
      const profile = await getUserProfile(data.session.user.id, userRole);

      const user: AuthUser = {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: profile.name,
        role: userRole,
        subscriptionStatus: profile.subscription_status,
        subscriptionTier: profile.subscription_tier
      };

      return { user };
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(err instanceof Error ? err.message : 'Login failed');
    }
  }

  async register(email: string, password: string, userData: UserRegistrationData) {
    try {
      return await registerUser({ ...userData, email, password });
    } catch (err) {
      console.error('Registration error:', err);
      throw new Error(err instanceof Error ? err.message : 'Registration failed');
    }
  }
}

export const authService = new AuthService();