import { supabase } from '../supabase';
import type { Property } from '../../types/property';

export class PropertyService {
  async createProperty(data: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>, agentId: string) {
    try {
      // Validate required fields
      if (!data.title || !data.address || !data.city || !data.price) {
        throw new Error('Missing required property fields');
      }

      // Ensure proper data structure
      const propertyData = {
        title: data.title,
        address: data.address,
        city: data.city,
        price: data.price,
        description: data.description || '',
        images: data.images || [],
        agent_id: agentId,
        status: data.status || 'available',
        category: data.category || 'residential',
        type: data.type || 'house',
        features: data.features || [],
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        square_feet: data.square_feet || null,
        listing_url: data.listing_url || null
      };

      const { data: property, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select('*')
        .single();

      if (error) {
        console.error('Create property error:', error);
        throw new Error(error.message);
      }

      return property;
    } catch (err) {
      console.error('Property service error:', err);
      throw err instanceof Error ? err : new Error('Failed to create property');
    }
  }

  async updateProperty(id: string, data: Partial<Property>) {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return property;
    } catch (err) {
      console.error('Update property error:', err);
      throw err instanceof Error ? err : new Error('Failed to update property');
    }
  }

  async deleteProperty(id: string) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Delete property error:', err);
      throw err instanceof Error ? err : new Error('Failed to delete property');
    }
  }
}

export const propertyService = new PropertyService();