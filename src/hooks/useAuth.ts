import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/AuthService';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await authService.login(email, password);
      
      if (!user) {
        throw new Error('Login failed - no user data received');
      }

      setUser(user);

      // Clear loading before navigation
      setLoading(false);

      if (user.role === 'agent') {
        if (!user.subscriptionStatus || user.subscriptionStatus === 'inactive') {
          navigate('/subscription');
        } else {
          navigate('/agent');
        }
      } else {
        navigate('/client');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.register(email, password, userData);
      
      if (!result?.user) {
        throw new Error('Registration failed - no user data received');
      }

      setUser(result.user);
      
      // Clear loading before navigation
      setLoading(false);

      if (result.user.role === 'agent') {
        navigate('/subscription');
      } else {
        navigate('/client');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error
  };
}