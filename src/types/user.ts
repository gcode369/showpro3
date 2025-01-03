export type UserRole = 'agent' | 'client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
};