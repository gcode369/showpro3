import type { UserRole } from '../../types/user';

export type AgentProfileData = {
  name: string;
  username?: string;
  phone?: string;
  subscription_tier: 'basic' | 'premium';
  subscription_status: 'trial' | 'active' | 'inactive';
};

export type ClientProfileData = {
  name: string;
  phone?: string;
  preferred_areas?: string[];
  preferred_contact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalification_details?: {
    amount?: string;
    lender?: string;
    expiry_date?: string;
  };
};