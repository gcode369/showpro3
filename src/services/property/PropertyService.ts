import { supabase } from '../supabase';
import type { Property } from '../../types/property';

export class PropertyService {
  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>, agentId: string) {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          ...data,
          agent_id: agentId,
          status: data.status || 'available'
        })
        .select()
        .single();

      if (error) {
        console.error('Create property error:', error);
        throw new Error('Failed to create property');
      }

      return property;
    } catch (err) {
      console.error('Property service error:', err);
      throw err instanceof Error ? err : new Error('Failed to create property');
    }
  }

  async updateProperty(id: string, data: Partial<Property>) {
    const { data: property, error } = await supabase
      .from('properties')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return property;
  }

  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const propertyService = new PropertyService();