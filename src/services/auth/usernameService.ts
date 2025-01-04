import { supabase } from '../supabase';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (error && error.code === 'PGRST116') {
    // No results found, username is available
    return true;
  }

  return false;
}

export async function searchAgentsByUsername(query: string) {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select(`
      user_id,
      username,
      name,
      photo_url,
      areas,
      subscription_status
    `)
    .ilike('username', `%${query}%`)
    .limit(10);

  if (error) throw error;
  return data || [];
}