import { useState, useEffect } from 'react';
import { useProperties } from './useProperties';
import { usePropertyShowings } from './usePropertyShowings';
import type { Property } from '../types/property';
import type { ShowingTimeSlot } from '../types/propertyShowing';

export function useCalendarSync(agentId?: string) {
  const { properties } = useProperties(agentId);
  const { showings, addPropertyShowing, updateShowingTimeSlots } = usePropertyShowings(agentId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group time slots by property and date
  const timeSlotsByProperty = showings.reduce((acc, showing) => {
    if (!acc[showing.propertyId]) {
      acc[showing.propertyId] = {};
    }
    
    showing.timeSlots.forEach(slot => {
      if (!acc[showing.propertyId][slot.date]) {
        acc[showing.propertyId][slot.date] = [];
      }
      acc[showing.propertyId][slot.date].push(slot);
    });
    
    return acc;
  }, {} as Record<string, Record<string, ShowingTimeSlot[]>>);

  // Add time slots for a property
  const addTimeSlots = async (propertyId: string, slots: Omit<ShowingTimeSlot, 'id'>[]) => {
    try {
      setError(null);
      const property = properties.find(p => p.id === propertyId);
      if (!property) throw new Error('Property not found');

      await addPropertyShowing(property, slots);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add time slots');
      return false;
    }
  };

  // Update existing time slots
  const updateTimeSlots = async (propertyId: string, showingId: string, slots: ShowingTimeSlot[]) => {
    try {
      setError(null);
      await updateShowingTimeSlots(showingId, slots);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update time slots');
      return false;
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [properties, showings]);

  return {
    properties,
    timeSlotsByProperty,
    loading,
    error,
    addTimeSlots,
    updateTimeSlots
  };
}