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
      setUser(user);

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
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register(email, password, userData);
      await login(email, password); // Auto login after registration
    } catch (err) {
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