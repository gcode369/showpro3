import { supabase } from '../supabase';
import type { Property } from '../../types/property';

export class PropertyService {
  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>) {
    const { data: property, error } = await supabase
      .from('properties')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return property;
  }
}

export const propertyService = new PropertyService();