import { supabase } from '../supabase';
import type { AuthUser } from '../../types/auth';
import { registerUser } from './registration';

export class AuthService {
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

      // Get user profile with subscription info
      const { data: profile, error: profileError } = await supabase
        .from(profileTable)
        .select('*')
        .eq('user_id', data.session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      // Ensure subscription status exists for agents
      if (userRole === 'agent' && !profile.subscription_status) {
        const { error: updateError } = await supabase
          .from('agent_profiles')
          .update({
            subscription_status: 'trial',
            subscription_tier: 'basic'
          })
          .eq('user_id', data.session.user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
        }

        profile.subscription_status = 'trial';
        profile.subscription_tier = 'basic';
      }

      return {
        session: data.session,
        user: {
          id: data.session.user.id,
          email: data.session.user.email!,
          name: profile.name,
          role: userRole,
          subscriptionStatus: profile.subscription_status || undefined,
          subscriptionTier: profile.subscription_tier || undefined
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

  async register(email: string, password: string, data: any) {
    return registerUser({
      email,
      password,
      ...data
    });
  }
}

export const authService = new AuthService();