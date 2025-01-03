import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { authService } from '../../services/auth/AuthService';
import { useAuthStore } from '../../store/authStore';
import { validateForm, agentRegistrationSchema } from '../../utils/validation';
import { ErrorAlert } from '../common/ErrorAlert';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { FormField } from './FormField';

export function AgentRegistrationForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validationResult = await validateForm(agentRegistrationSchema, formData);
      if (!validationResult.success) {
        setError(validationResult.error);
        setLoading(false);
        return;
      }

      const { session, user } = await authService.register(formData.email, formData.password, {
        name: formData.name,
        role: 'agent'
      });

      if (!session?.user) {
        throw new Error('Registration failed - no session created');
      }

      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: formData.name,
        role: 'agent',
        subscriptionStatus: 'trial'
      });

      navigate('/subscription');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(XXX) XXX-XXXX"
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Creating Account...</span>
          </div>
        ) : (
          'Continue to Subscription'
        )}
      </Button>
    </form>
  );
}