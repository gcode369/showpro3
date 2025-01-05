import { supabase } from '../supabase';
import type { UserRole } from '../../types/auth';
import type { AgentProfile, ClientProfile, ProfileData } from './types';

export async function getUserProfile(userId: string, role: UserRole): Promise<AgentProfile | ClientProfile> {
  const profileTable = role === 'agent' ? 'agent_profiles' : 'client_profiles';
  
  const { data: profile, error } = await supabase
    .from(profileTable)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Profile fetch error:', error);
    throw new Error('Failed to fetch user profile');
  }

  return profile;
}

export async function createUserProfile(userId: string, role: UserRole, data: ProfileData): Promise<void> {
  const profileTable = role === 'agent' ? 'agent_profiles' : 'client_profiles';
  const profileData = role === 'agent' ? {
    user_id: userId,
    name: data.name,
    subscription_status: 'trial',
    subscription_tier: 'basic'
  } : {
    user_id: userId,
    name: data.name
  };

  const { error } = await supabase
    .from(profileTable)
    .insert(profileData);

  if (error) {
    console.error('Profile creation error:', error);
    throw new Error('Failed to create user profile');
  }
}