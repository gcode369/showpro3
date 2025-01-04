import type { UserRole } from './user';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  username?: string;
  role: UserRole;
  phone?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'trial';
};

export type AuthResponse = {
  session: {
    user: {
      id: string;
      email: string;
    };
  } | null;
  profile: UserProfile;
};