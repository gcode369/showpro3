import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanCard } from '../../components/subscription/PlanCard';
import { useAuthStore } from '../../store/authStore';
import { SUBSCRIPTION_PLANS } from '../../config/subscriptionPlans';
import type { PlanType } from '../../types/subscription';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to dashboard if user already has active subscription
    if (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial') {
      navigate('/agent');
    }
  }, [user?.subscriptionStatus, navigate]);

  // Return null while checking subscription status to prevent flash of content
  if (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial') {
    return null;
  }

  const handleSubscribe = (planType: PlanType) => {
    try {
      if (!user) {
        throw new Error('Please log in to subscribe');
      }
      window.location.href = SUBSCRIPTION_PLANS[planType].paymentLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Subscription Plan</h1>
          <p className="text-lg text-gray-600">Get access to all premium features and grow your real estate business</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {(Object.entries(SUBSCRIPTION_PLANS) as [PlanType, typeof SUBSCRIPTION_PLANS[PlanType]][]).map(([key, plan]) => (
            <PlanCard
              key={key}
              plan={plan}
              planType={key}
              onSubscribe={() => handleSubscribe(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}