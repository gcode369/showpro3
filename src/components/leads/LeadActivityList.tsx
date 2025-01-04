import React from 'react';
import { ActivityItem } from './ActivityItem';
import type { LeadActivity } from '../../types/lead';

type LeadActivityListProps = {
  activities: LeadActivity[];
  className?: string;
};

export function LeadActivityList({ activities, className = '' }: LeadActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activities recorded yet.
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}