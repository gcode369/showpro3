import type { UserRole } from '../../types/user';

export type ProfileData = {
  name: string;
  username?: string;
  phone?: string;
};

export type AgentProfileData = ProfileData & {
  subscription_tier: 'basic' | 'premium';
  subscription_status: 'trial' | 'active' | 'inactive';
};

export type ClientProfileData = ProfileData & {
  preferred_areas?: string[];
  preferred_contact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalification_details?: {
    amount?: string;
    lender?: string;
    expiry_date?: string;
  };
};

export type RegistrationResult = {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
  session: any;
};