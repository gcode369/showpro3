import { supabase } from '../supabase';
import type { UserRegistrationData } from '../../types/user';
import { createAgentProfile, createClientProfile } from './profileService';

export async function registerUser(data: UserRegistrationData) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        role: data.role
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('An account with this email already exists');
    }
    throw error;
  }

  if (!authData.user) {
    throw new Error('Registration failed - no user created');
  }

  // Create role-specific profile
  if (data.role === 'agent') {
    await createAgentProfile(authData.user.id, {
      name: data.name,
      subscription_tier: 'basic',
      subscription_status: 'trial'
    });
  } else {
    await createClientProfile(authData.user.id, {
      name: data.name,
      phone: data.phone,
      preferred_areas: [],
      preferred_contact: 'email'
    });
  }

  return { session: authData.session, user: authData.user };
}