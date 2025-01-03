import { Agent } from './agent';

export type PropertyCategory = 'residential' | 'commercial';

export type PropertyType = {
  residential: 'house' | 'condo' | 'townhouse' | 'apartment';
  commercial: 'office' | 'retail' | 'industrial' | 'warehouse';
};

export type Property = {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  description: string;
  images: string[];
  agent_id: string; // Changed from agentId to match database
  agent?: Agent;
  status: 'available' | 'pending' | 'sold';
  category: PropertyCategory;
  type: PropertyType[PropertyCategory];
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number; // Changed from squareFeet to match database
  listing_url?: string; // Changed from listingUrl to match database
  created_at: string; // Changed from createdAt to match database
  updated_at: string; // Changed from updatedAt to match database
};