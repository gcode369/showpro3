export type UserRole = 'agent' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: UserRole;
  phone?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
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