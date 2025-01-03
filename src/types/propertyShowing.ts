import type { Property } from './property';

export type ShowingTimeSlot = {
  id: string;
  propertyId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
};

export type PropertyShowing = {
  id: string;
  propertyId: string;
  property: Property;
  timeSlots: ShowingTimeSlot[];
  notes?: string;
  showingInstructions?: string;
};