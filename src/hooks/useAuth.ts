import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/AuthService';
import { useAuthStore } from '../store/authStore';
import { useLoadingState } from './useLoadingState';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { loading, error, startLoading, stopLoading } = useLoadingState();

  const handleAuthSuccess = useCallback((user: any) => {
    setUser(user);
    stopLoading();
    
    // Use setTimeout to ensure state updates complete before navigation
    setTimeout(() => {
      if (user.role === 'agent') {
        if (!user.subscriptionStatus || user.subscriptionStatus === 'inactive') {
          navigate('/subscription');
        } else {
          navigate('/agent');
        }
      } else {
        navigate('/client');
      }
    }, 0);
  }, [setUser, stopLoading, navigate]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      startLoading();
      const { user } = await authService.login(email, password);
      
      if (!user) {
        throw new Error('Login failed - no user data received');
      }

      handleAuthSuccess(user);
    } catch (err) {
      console.error('Login error:', err);
      stopLoading(err instanceof Error ? err.message : 'Login failed');
    }
  }, [startLoading, stopLoading, handleAuthSuccess]);

  const register = useCallback(async (email: string, password: string, userData: any) => {
    try {
      startLoading();
      const result = await authService.register(email, password, userData);
      
      if (!result?.user) {
        throw new Error('Registration failed - no user data received');
      }

      handleAuthSuccess(result.user);
    } catch (err) {
      console.error('Registration error:', err);
      stopLoading(err instanceof Error ? err.message : 'Registration failed');
    }
  }, [startLoading, stopLoading, handleAuthSuccess]);

  return {
    login,
    register,
    loading,
    error
  };
}