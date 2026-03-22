import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
// LandingPage is no longer the default view
import Dashboard from './pages/OrganicDashboard';
import UploadFood from './pages/PremiumUploadFood';
import NutritionResult from './pages/NutritionResult';
import CalorieTracker from './pages/CalorieTracker';
import HealthDashboard from './pages/HealthDashboard';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  // Ensure the user is populated automatically if they hit the app without login
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 22, 40, 0.95)',
            color: '#f0f6fc',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Skip the landing page completely and go straight to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* All application routes are now completely public - No Authentication Guard */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadFood />} />
          <Route path="/result" element={<NutritionResult />} />
          <Route path="/tracker" element={<CalorieTracker />} />
          <Route path="/health" element={<HealthDashboard />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
