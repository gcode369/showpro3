import { create } from 'zustand';

type LoadingState = {
  loading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: (error?: string) => void;
};

export const useLoadingState = create<LoadingState>((set) => ({
  loading: true, // Start with loading true
  error: null,
  startLoading: () => set({ loading: true, error: null }),
  stopLoading: (error) => set({ loading: false, error: error || null })
}));