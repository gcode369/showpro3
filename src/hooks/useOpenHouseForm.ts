import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { OpenHouse } from '../types/openHouse';

export function useOpenHouseForm() {
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Omit<OpenHouse, 'id' | 'agentId' | 'agentName' | 'attendees'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const openHouseData = {
        ...formData,
        agentId: user.id,
        agentName: user.name,
        attendees: []
      };

      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Creating open house:', openHouseData);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create open house');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
}