import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

type LoadingGuardProps = {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
};

export function LoadingGuard({ loading, error, children }: LoadingGuardProps) {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return <>{children}</>;
}