import ClaimStatus from './pages/user/ClaimStatus';
import BuyPolicy from './pages/user/BuyPolicy';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortalProvider } from './context/PortalContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import PolicyManagement from './pages/admin/PolicyManagement';
import ClaimsManagement from './pages/admin/ClaimsManagement';
import UserManagement   from './pages/admin/UserManagement';
import Agents           from './pages/admin/Agents';
import Reports          from './pages/admin/Reports';
import Settings         from './pages/admin/Settings';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MyPolicies    from './pages/user/MyPolicies';
import MyClaims      from './pages/user/MyClaims';
import Payments      from './pages/user/Payments';
import Profile       from './pages/user/Profile';
import Support       from './pages/user/Support';

// Security Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};



const AppShell = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="app-layout">
      {/* Backdrop for mobile UX when sidebar is open */}
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
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/policies"  element={<PolicyManagement />} />
          <Route path="/admin/claims"    element={<ClaimsManagement />} />
          <Route path="/admin/users"     element={<UserManagement />} />
          <Route path="/admin/agents"    element={<Agents />} />
          <Route path="/admin/reports"   element={<Reports />} />
          <Route path="/admin/settings"  element={<Settings />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/policies"  element={<MyPolicies />} />
          <Route path="/user/claims"    element={<MyClaims />} />
          <Route path="/user/payments"  element={<Payments />} />
          <Route path="/user/profile"   element={<Profile />} />
          <Route path="/user/support"   element={<Support />} />
          <Route path="/user/buy-policy" element={<BuyPolicy />} />
          <Route path="/user/claim-status" element={<ClaimStatus />} />

          {/* Default redirect inside shell */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>

      {/* Render Chatbot only for user routes */}
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
        
        {/* Core application routes are exclusively protected */}
        <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </PortalProvider>
);

export default App;
