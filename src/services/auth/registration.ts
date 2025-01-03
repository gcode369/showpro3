import { supabase } from '../supabase';
import type { UserRegistrationData } from '../../types/user';
import { createAgentProfile, createClientProfile } from './profileService';
import type { AgentProfileData, ClientProfileData } from './types';

export async function registerUser(data: UserRegistrationData) {
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

    if (!authData.user) {
      throw new Error('Registration failed - no user created');
    }

    // Create role-specific profile
    if (data.role === 'agent') {
      const agentData: AgentProfileData = {
        name: data.name,
        phone: data.phone,
        subscription_tier: 'basic',
        subscription_status: 'trial',
        areas: [],
        languages: [],
        certifications: []
      };
      await createAgentProfile(authData.user.id, agentData);
    } else {
      const clientData: ClientProfileData = {
        name: data.name,
        phone: data.phone,
        preferred_areas: data.preferredAreas || [],
        preferred_contact: data.preferredContact || 'email',
        prequalified: data.prequalified || false,
        prequalification_details: data.prequalified ? {
          amount: data.prequalificationDetails?.amount,
          lender: data.prequalificationDetails?.lender,
          expiry_date: data.prequalificationDetails?.expiryDate
        } : undefined
      };
      await createClientProfile(authData.user.id, clientData);
    }

    return { session: authData.session, user: authData.user };
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
}