import { supabase } from '../supabase';
import { mapSessionToAuthSession } from './types';
import type { AuthSession } from '../../types/auth';

export async function getSession(): Promise<AuthSession | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Session fetch error:', error);
    return null;
  }
  return session ? mapSessionToAuthSession(session) : null;
}

export async function refreshSession(): Promise<AuthSession | null> {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Session refresh error:', error);
    return null;
  }
  return session ? mapSessionToAuthSession(session) : null;
}