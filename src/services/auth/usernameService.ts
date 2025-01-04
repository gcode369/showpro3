import { supabase } from '../supabase';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('agent_profiles')
      .select('username', { count: 'exact', head: true })
      .eq('username', username);

    if (error) throw error;
    
    // If count is 0, username is available
    return count === 0;
  } catch (err) {
    console.error('Username check error:', err);
    throw new Error('Failed to check username availability');
  }
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