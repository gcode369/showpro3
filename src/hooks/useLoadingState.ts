import { useState, useCallback } from 'react';

export function useLoadingState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback((error?: string) => {
    setLoading(false);
    setError(error || null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading
  };
}