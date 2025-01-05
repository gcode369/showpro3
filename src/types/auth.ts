import type { UserRole } from './user';

export type AuthResponse = {
  session: {
    user: {
      id: string;
      email: string;
    };
  } | null;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    subscriptionStatus?: 'trial' | 'active' | 'inactive';
  };
};

export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  username?: string;
  phone?: string;
  role: UserRole;
  preferredAreas?: string[];
  preferredContact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalificationDetails?: {
    amount?: string;
    lender?: string;
    expiryDate?: string;
  };
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus?: 'trial' | 'active' | 'inactive';
  subscriptionTier?: 'basic' | 'premium';
};