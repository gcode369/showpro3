import { useState } from 'react';
import { useProperties } from './useProperties';
import { useAuthStore } from '../store/authStore';
import type { Property } from '../types/property';

export function usePropertyForm() {
  const { user } = useAuthStore();
  const { addProperty } = useProperties();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      await addProperty({
        ...formData,
        agent_id: user.id
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, error, loading };
}