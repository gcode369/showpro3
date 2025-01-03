import { supabase } from '../supabase';
import type { User } from '../../types/user';
import { createAgentProfile } from './profileService';

export class AuthService {
  async register(email: string, password: string, userData: Partial<User>) {
    try {
      // 1. Create auth user
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

      // 2. Create profile if agent
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

  // ... rest of the class implementation stays the same
}

export const authService = new AuthService();