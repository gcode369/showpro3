import { supabase } from '../supabase';
import type { UserRegistrationData } from '../../types/user';
import { registerUser } from './registration';

export class AuthService {
  async login(email: string, password: string) {
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

      if (profileError) throw profileError;

      return {
        session: data.session,
        profile: {
          id: data.session.user.id,
          email: data.session.user.email!,
          name: profile.name,
          role: userRole,
          phone: profile.phone,
          subscriptionStatus: profile.subscription_status
        }
      };
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw err;
      }
      throw new Error('Login failed');
    }
  }

  async register(email: string, password: string, userData: Partial<UserRegistrationData>) {
    try {
      return await registerUser({
        email,
        password,
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || 'client'
      });
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

export const authService = new AuthService();