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

      if (!profile) {
        throw new Error('User profile not found');
      }

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
      throw err instanceof Error ? err : new Error('Login failed');
    }
  }

  async register(email: string, password: string, userData: UserRegistrationData) {
    try {
      const result = await registerUser({ ...userData, email, password });
      if (!result?.user) {
        throw new Error('Registration failed - invalid response');
      }
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      throw err instanceof Error ? err : new Error('Registration failed');
    }
  }
}

export const authService = new AuthService();