export type UserRegistrationData = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  username?: string; // Add username field
  preferredAreas?: string[];
  preferredContact?: 'email' | 'phone' | 'both';
  prequalified?: boolean;
  prequalificationDetails?: {
    amount?: string;
    lender?: string;
    expiryDate?: string;
  };
};
