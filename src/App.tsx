import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingGuard } from './components/common/LoadingGuard';
import { useSession } from './hooks/useSession';
import { useLoadingState } from './hooks/useLoadingState';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { LearnMorePage } from './pages/LearnMore';
import { PropertiesPage } from './pages/Properties';
import { CalendarPage } from './pages/Calendar';
import { ClientsPage } from './pages/Clients';
import { ProfilePage } from './pages/Profile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  useSession();
  const { loading, error } = useLoadingState();

  return (
    <ErrorBoundary>
      <LoadingGuard loading={loading} error={error}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            
            <Route
              path="/agent"
              element={
                <ProtectedRoute userType="agent">
                  <Layout userType="agent" />
                </ProtectedRoute>
              }
            >
              <Route index element={<CalendarPage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route
              path="/client"
              element={
                <ProtectedRoute userType="client">
                  <Layout userType="client" />
                </ProtectedRoute>
              }
            >
              <Route index element={<PropertiesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoadingGuard>
    </ErrorBoundary>
  );
}