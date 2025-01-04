import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect if user is already subscribed or in trial
    if (user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial') {
      navigate('/agent', { replace: true });
    }
    // Redirect if not an agent
    else if (user?.role !== 'agent') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Don't render anything while checking subscription status
  if (!user || user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trial' || user.role !== 'agent') {
    return null;
  }

  // Only show subscription page for agents who need to subscribe
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the plan that best fits your needs</p>
        </div>

        {/* Subscription content */}
        {/* ... rest of the subscription page content ... */}
      </div>
    </div>
  );
}