import { supabase } from '../supabase';
import type { UserRegistrationData } from '../../types/auth';
import { createAgentProfile, createClientProfile } from './profileService';
import type { RegistrationResult } from './types';

export async function registerUser(data: UserRegistrationData): Promise<RegistrationResult> {
  try {
    // Create auth user
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
          phone: data.phone
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('An account with this email already exists');
      }
      throw error;
    }

    if (!authData.user?.email) {
      throw new Error('Registration failed - invalid user data');
    }

    // Create role-specific profile
    if (data.role === 'agent') {
      await createAgentProfile(authData.user.id, {
        name: data.name,
        username: data.username?.toLowerCase(),
        phone: data.phone,
        subscription_tier: 'basic',
        subscription_status: 'trial'
      });
    } else {
      await createClientProfile(authData.user.id, {
        name: data.name,
        phone: data.phone,
        preferred_areas: data.preferredAreas || [],
        preferred_contact: data.preferredContact || 'email',
        prequalified: data.prequalified || false,
        prequalification_details: data.prequalificationDetails
      });
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: data.role
      },
      session: authData.session
    };
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
}