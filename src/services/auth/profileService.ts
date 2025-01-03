import { supabase } from '../supabase';
import type { AgentProfileData, ClientProfileData } from './types';

export async function createAgentProfile(userId: string, data: AgentProfileData) {
  const { error } = await supabase
    .from('agent_profiles')
    .insert({
      user_id: userId,
      name: data.name,
      phone: data.phone,
      areas: data.areas || [],
      bio: data.bio,
      languages: data.languages || [],
      certifications: data.certifications || [],
      subscription_tier: data.subscription_tier,
      subscription_status: data.subscription_status
    });

  if (error) throw error;
}

export async function createClientProfile(userId: string, data: ClientProfileData) {
  const { error } = await supabase
    .from('client_profiles')
    .insert({
      user_id: userId,
      name: data.name,
      phone: data.phone,
      preferred_areas: data.preferred_areas || [],
      preferred_contact: data.preferred_contact || 'email',
      prequalified: data.prequalified || false,
      prequalification_details: data.prequalification_details || {}
    });

  if (error) throw error;
}

export async function getProfile(userId: string, role: 'agent' | 'client') {
  const table = role === 'agent' ? 'agent_profiles' : 'client_profiles';
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}