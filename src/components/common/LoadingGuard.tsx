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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}