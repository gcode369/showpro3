import { useState } from 'react';
import { propertyService } from '../services/property/PropertyService';
import { useAuthStore } from '../store/authStore';
import type { Property } from '../types/property';

export function usePropertyForm() {
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'agent_id'>) => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      if (!formData.title || !formData.address || !formData.city || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      // Create property
      await propertyService.createProperty(formData, user.id);
      return true;
    } catch (err) {
      console.error('Property form error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add property');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, error, loading };
}