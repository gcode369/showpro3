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

      const { session, user } = await authService.login(email, password);

      if (!session?.user) {
        throw new Error('Login failed - no session created');
      }

      setUser(user);

      // Navigate based on role and subscription status
      if (user.role === 'agent') {
        if (!user.subscriptionStatus || user.subscriptionStatus === 'inactive') {
          navigate('/subscription');
          return;
        }
        navigate('/agent');
      } else {
        navigate('/client');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
}