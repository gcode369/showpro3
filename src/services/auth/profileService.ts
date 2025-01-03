import { supabase } from '../supabase';

export async function createAgentProfile(userId: string, data: {
  name: string;
  subscription_tier: 'basic' | 'premium';
  subscription_status: 'trial' | 'active' | 'inactive';
}) {
  const { error } = await supabase
    .from('agent_profiles')
    .insert({
      user_id: userId,
      name: data.name,
      subscription_tier: data.subscription_tier,
      subscription_status: data.subscription_status
    });

  if (error) throw error;
}