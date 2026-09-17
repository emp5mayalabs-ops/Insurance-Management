import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public website pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import AchievementsPage from './pages/public/AchievementsPage';
import ContactPage from './pages/public/ContactPage';

// Auth pages
import LoginTypePage from './pages/auth/LoginTypePage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AgentLoginPage from './pages/auth/AgentLoginPage';
import CustomerLoginPage from './pages/auth/CustomerLoginPage';

// Admin portal
import AdminLayout from './pages/AdminLayout';

// Agent portal
import AgentLayout from './pages/agent/AgentLayout';

import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public website ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── Auth / Login ── */}
          <Route path="/login" element={<LoginTypePage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/login/agent" element={<AgentLoginPage />} />
          <Route path="/login/customer" element={<CustomerLoginPage />} />

          {/* ── Admin portal (protected inside AdminLayout) ── */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* ── Agent portal (protected inside AgentLayout) ── */}
          <Route path="/agent/*" element={<AgentLayout />} />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
