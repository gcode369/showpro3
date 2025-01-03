export type UserRole = 'agent' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
};

export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
};