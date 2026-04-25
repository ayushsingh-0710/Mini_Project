import ClaimStatus from './pages/user/ClaimStatus';
import BuyPolicy from './pages/user/BuyPolicy';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortalProvider } from './context/PortalContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import PolicyManagement from './pages/admin/PolicyManagement';
import ClaimsManagement from './pages/admin/ClaimsManagement';
import UserManagement from './pages/admin/UserManagement';
import Agents from './pages/admin/Agents';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

import UserDashboard from './pages/user/UserDashboard';
import MyPolicies from './pages/user/MyPolicies';
import MyClaims from './pages/user/MyClaims';
import Payments from './pages/user/Payments';
import Profile from './pages/user/Profile';
import Support from './pages/user/Support';

import AgentDashboard from './pages/agent/AgentDashboard';
import AssignedLeads from './pages/agent/AssignedLeads';
import AgentPolicies from './pages/agent/AgentPolicies';
import RecommendPolicy from './pages/agent/RecommendPolicy';
import CreateQuote from './pages/agent/CreateQuote';
import SalesTracking from './pages/agent/SalesTracking';
import Commission from './pages/agent/Commission';
import Clients from './pages/agent/Clients';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppShell = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="app-layout">
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <Header
          currentPath={location.pathname}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/policies" element={<PolicyManagement />} />
          <Route path="/admin/claims" element={<ClaimsManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/agents" element={<Agents />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />

          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/policies" element={<MyPolicies />} />
          <Route path="/user/claims" element={<MyClaims />} />
          <Route path="/user/payments" element={<Payments />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/support" element={<Support />} />
          <Route path="/user/buy-policy" element={<BuyPolicy />} />
          <Route path="/user/claim-status" element={<ClaimStatus />} />

          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/leads" element={<AssignedLeads />} />
          <Route path="/agent/policies" element={<AgentPolicies />} />
          <Route path="/agent/recommend" element={<RecommendPolicy />} />
          <Route path="/agent/quote" element={<CreateQuote />} />
          <Route path="/agent/sales" element={<SalesTracking />} />
          <Route path="/agent/commission" element={<Commission />} />
          <Route path="/agent/clients" element={<Clients />} />

          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </div>

      {location.pathname.startsWith('/user') && <Chatbot />}
    </div>
  );
};

const App = () => (
  <PortalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </PortalProvider>
);

export default App;