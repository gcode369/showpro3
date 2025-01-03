import { supabase } from '../supabase';
import type { User } from '../../types/user';
import { createAgentProfile } from './profileService';

export class AuthService {
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.session?.user) throw new Error('Login failed - no session created');

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from(data.session.user.user_metadata.role === 'agent' ? 'agent_profiles' : 'client_profiles')
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
          role: data.session.user.user_metadata.role,
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

  async register(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('Registration failed - no user created');

      if (userData.role === 'agent') {
        await createAgentProfile(data.user.id, {
          name: userData.name || '',
          subscription_tier: 'basic',
          subscription_status: 'trial'
        });
      }

      return { session: data.session, user: data.user };
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          throw new Error('An account with this email already exists');
        }
        throw err;
      }
      throw new Error('Registration failed');
    }
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

export const authService = new AuthService();