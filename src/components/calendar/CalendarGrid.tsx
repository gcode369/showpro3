import React from 'react';
import { CalendarCell } from './CalendarCell';
import type { ShowingTimeSlot } from '../../types/propertyShowing';

type CalendarGridProps = {
  currentDate: Date;
  timeSlots: Record<string, ShowingTimeSlot[]>;
  readOnly?: boolean;
  onSlotSelect?: (slot: ShowingTimeSlot) => void;
};

export function CalendarGrid({ currentDate, timeSlots, readOnly, onSlotSelect }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({ date: prevDate, isPadding: true });
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isPadding: false });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
          {day}
        </div>
      ))}
      
      {days.map(({ date, isPadding }, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const daySlots = timeSlots[dateStr] || [];

        return (
          <CalendarCell
            key={index}
            date={date}
            slots={daySlots}
            isPadding={isPadding}
            readOnly={readOnly}
            onSlotSelect={onSlotSelect}
          />
        );
      })}
    </div>
  );
}