import { supabase } from '../supabase';
import type { OpenHouse } from '../../types/openHouse';

export class OpenHouseService {
  async getOpenHouses(filters?: { city?: string; date?: string }) {
    try {
      let query = supabase
        .from('open_houses')
        .select(`
          *,
          property:property_id (
            id,
            title,
            images,
            address,
            city
          ),
          agent:agent_id (
            name
          )
        `)
        .gte('date', new Date().toISOString().split('T')[0]); // Only future open houses

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.date) {
        query = query.eq('date', filters.date);
      }

      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching open houses:', error);
        throw new Error('Failed to fetch open houses');
      }

      return data || [];
    } catch (err) {
      console.error('Open house service error:', err);
      throw new Error('Failed to fetch open houses');
    }
  }

  async createOpenHouse(data: Omit<OpenHouse, 'id' | 'agentName' | 'attendees'>) {
    try {
      const { data: openHouse, error } = await supabase
        .from('open_houses')
        .insert({
          property_id: data.propertyId,
          agent_id: data.agentId,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          max_attendees: data.maxAttendees,
          address: data.address,
          city: data.city,
          province: data.province,
          postal_code: data.postalCode
        })
        .select()
        .single();

      if (error) throw error;
      return openHouse;
    } catch (err) {
      console.error('Error creating open house:', err);
      throw new Error('Failed to create open house');
    }
  }

  async registerAttendee(openHouseId: string, attendeeData: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
    interestedInSimilar: boolean;
    prequalified: boolean;
  }) {
    try {
      const { error } = await supabase
        .from('open_house_leads')
        .insert({
          open_house_id: openHouseId,
          ...attendeeData,
          follow_up_status: 'pending'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error registering attendee:', err);
      throw new Error('Failed to register for open house');
    }
  }
}

export const openHouseService = new OpenHouseService();