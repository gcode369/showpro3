import { supabase } from '../supabase';
import type { AgentProfileData, ClientProfileData } from './types';

export async function createAgentProfile(userId: string, data: AgentProfileData) {
  try {
    const { error } = await supabase
      .from('agent_profiles')
      .insert({
        user_id: userId,
        name: data.name,
        username: data.username?.toLowerCase(),
        phone: data.phone,
        subscription_tier: data.subscription_tier,
        subscription_status: data.subscription_status
      });

    if (error) {
      console.error('Agent profile creation error:', error);
      throw error;
    }
  } catch (err) {
    console.error('Create agent profile error:', err);
    throw err instanceof Error ? err : new Error('Failed to create agent profile');
  }
}

export async function createClientProfile(userId: string, data: ClientProfileData) {
  try {
    const { error } = await supabase
      .from('client_profiles')
      .insert({
        user_id: userId,
        name: data.name,
        phone: data.phone,
        preferred_areas: data.preferred_areas || [],
        preferred_contact: data.preferred_contact || 'email',
        prequalified: data.prequalified || false,
        prequalification_details: data.prequalification_details
      });

    if (error) {
      console.error('Client profile creation error:', error);
      throw error;
    }
  } catch (err) {
    console.error('Create client profile error:', err);
    throw err instanceof Error ? err : new Error('Failed to create client profile');
  }
}