import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { 
  HomePage,
  LearnMorePage,
  PropertiesPage,
  CalendarPage,
  ClientsPage,
  ProfilePage 
} from './pages';
import {
  AgentLoginPage,
  ClientLoginPage,
  AgentRegisterPage,
  ClientRegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from './pages/auth';
import { SubscriptionPage } from './pages/subscription';
import { OpenHousesPage } from './pages/agent';
import {
  SearchPage,
  ViewingsPage,
  ClientOpenHousesPage,
  AgentProfilePage,
  FeedPage,
  RankingsPage
} from './pages/client';
import { PaymentSuccessPage, PaymentCancelPage } from './pages/payment';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/login/agent" element={<AgentLoginPage />} />
        <Route path="/login/client" element={<ClientLoginPage />} />
        <Route path="/register/agent" element={<AgentRegisterPage />} />
        <Route path="/register/client" element={<ClientRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Subscription Route - Protected for agents only */}
        <Route path="/subscription" element={
          <ProtectedRoute userType="agent">
            <SubscriptionPage />
          </ProtectedRoute>
        } />
        
        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        
        {/* Protected Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute userType="agent" requiresSubscription>
            <Layout userType="agent" />
          </ProtectedRoute>
        }>
          <Route index element={<CalendarPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="open-houses" element={<OpenHousesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Protected Client Routes */}
        <Route path="/client" element={
          <ProtectedRoute userType="client">
            <Layout userType="client" />
          </ProtectedRoute>
        }>
          <Route index element={<SearchPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="rankings" element={<RankingsPage />} />
          <Route path="viewings" element={<ViewingsPage />} />
          <Route path="open-houses" element={<ClientOpenHousesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="agent/:agentId" element={<AgentProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}