import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
  userType?: 'agent' | 'client';
  requiresSubscription?: boolean;
};

export function ProtectedRoute({ children, userType, requiresSubscription = false }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login/${userType || 'client'}`} state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (userType && user.role !== userType) {
    return <Navigate to={`/login/${userType}`} state={{ from: location }} replace />;
  }

  // Check subscription for agent routes
  if (requiresSubscription && user.role === 'agent') {
    const needsSubscription = !user.subscriptionStatus || user.subscriptionStatus === 'inactive';
    const isSubscriptionPage = location.pathname === '/subscription';

    if (needsSubscription && !isSubscriptionPage) {
      return <Navigate to="/subscription" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}