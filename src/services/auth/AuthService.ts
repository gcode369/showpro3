import { supabase } from '../supabase';
import type { AuthUser } from '../../types/auth';

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

      // For agents, ensure subscription data exists
      if (userRole === 'agent') {
        if (!profile.subscription_status) {
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
      }

      const user: AuthUser = {
        id: data.session.user.id,
        email: data.session.user.email!,
        name: profile.name,
        role: userRole,
        subscriptionStatus: profile.subscription_status,
        subscriptionTier: profile.subscription_tier
      };

      return { session: data.session, user };
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
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (result.error) throw result.error;
      return result.data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  }
}

export const authService = new AuthService();