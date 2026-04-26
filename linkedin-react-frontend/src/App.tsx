import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import { AIChatbot } from './components/ai/AIChatbot';
import { CVBuilderFAB } from './components/common/CVBuilderFAB';
import { OnboardingWizard } from './components/common/OnboardingWizard';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Graduates = lazy(() => import('./pages/Graduates'));
const GraduateProfilePage = lazy(() => import('./pages/GraduateProfile'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const CVBuilder = lazy(() => import('./pages/CVBuilder'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ResendVerification = lazy(() => import('./pages/ResendVerification'));
const CheckEmail = lazy(() => import('./pages/CheckEmail'));
const CompanyPage = lazy(() => import('./pages/CompanyPage'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Help = lazy(() => import('./pages/Help'));
const Landing = lazy(() => import('./pages/Landing'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div style={{ width: 32, height: 32, border: '3px solid rgba(96,165,250,0.15)', borderTopColor: '#60A5FA', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <>{children}</> : <Navigate to="/landing" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />
            <Route path="/graduates" element={<ProtectedRoute><Layout><Graduates /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><GraduateProfilePage /></Layout></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Layout><MyApplications /></Layout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><EmployerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
            <Route path="/cv-builder" element={<ProtectedRoute><Layout><CVBuilder /></Layout></ProtectedRoute>} />
            <Route path="/interview-prep" element={<ProtectedRoute><Layout><InterviewPrep /></Layout></ProtectedRoute>} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/help" element={<Help />} />
            <Route path="/company/:id" element={<ProtectedRoute><Layout><CompanyPage /></Layout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <AIChatbot />
        <CVBuilderFAB />
        <OnboardingWizard />
      </Router>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
