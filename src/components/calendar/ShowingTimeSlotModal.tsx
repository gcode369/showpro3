import React, { useState } from 'react';
import { X, Clock, Users } from 'lucide-react';
import { Button } from '../common/Button';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type ShowingTimeSlotModalProps = {
  propertyId: string;
  date: string;
  onClose: () => void;
  onAdd: (slots: Omit<ShowingTimeSlot, 'id'>[]) => void;
};

export function ShowingTimeSlotModal({
  propertyId,
  date,
  onClose,
  onAdd
}: ShowingTimeSlotModalProps) {
  const [slots, setSlots] = useState<Omit<ShowingTimeSlot, 'id'>[]>([
    {
      propertyId,
      date,
      startTime: '09:00',
      endTime: '10:00',
      isBooked: false,
      maxAttendees: 1
    }
  ]);

  const addSlot = () => {
    const lastSlot = slots[slots.length - 1];
    const [hours, minutes] = lastSlot.endTime.split(':');
    const nextStart = lastSlot.endTime;
    const nextEnd = `${String(Number(hours) + 1).padStart(2, '0')}:${minutes}`;

    setSlots([
      ...slots,
      {
        propertyId,
        date,
        startTime: nextStart,
        endTime: nextEnd,
        isBooked: false,
        maxAttendees: 1
      }
    ]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, updates: Partial<ShowingTimeSlot>) => {
    setSlots(slots.map((slot, i) =>
      i === index ? { ...slot, ...updates } : slot
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(slots);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Add Showing Time Slots</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateSlot(index, { startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        updateSlot(index, { endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={slot.maxAttendees}
                    onChange={(e) =>
                      updateSlot(index, { maxAttendees: Number(e.target.value) })
                    }
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500 hover:text-red-700 mt-6"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={addSlot}
              className="flex items-center gap-2"
            >
              Add Another Slot
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Time Slots</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}