export type AgentProfileData = {
    name: string;
    phone?: string;
    subscription_tier: 'basic' | 'premium';
    subscription_status: 'trial' | 'active' | 'inactive';
    areas?: string[];
    bio?: string;
    languages?: string[];
    certifications?: string[];
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