import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, ShieldCheck, FileCheck, BarChart3, 
  LogOut, Wifi, WifiOff, RefreshCw, HelpCircle,
  Menu, Search, Bell, Home, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkBackendStatus, getBaseUrl } from '../../services/api';
import AgentProfilePage from './AgentProfilePage';
import CustomersPage from './CustomersPage';
import CustomerViewPage from './CustomerViewPage';

export default function AgentLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Sync current active tab with URL path
  const currentTab = location.pathname.split('/')[2] || 'profile';

  // Protected route guard: Redirect to agent login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/agent', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const verifyBackend = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkBackendStatus();
    setBackendStatus({
      online: result.online,
      checking: false,
      url: result.url,
      error: result.error,
    });
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (tab) => {
    navigate(`/agent/${tab}`);
  };

  if (!isAuthenticated) return null;

  const agentInitials = (user?.username || 'AG')
    .slice(0, 2)
    .toUpperCase();

  const getSidebarLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    margin: '0.25rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#4f46e5' : 'transparent',
    transition: 'all 0.2s',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.875rem'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #334155', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '0.25rem', borderRadius: '0.25rem', display: 'flex' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.5px' }}>MASTERS COMPANION</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.5px' }}>AGENT PORTAL</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={getSidebarLinkStyle(currentTab === 'dashboard')} onClick={() => handleNavigate('dashboard')}>
            <Home size={18} /> Dashboard
          </div>
          <div style={getSidebarLinkStyle(currentTab === 'profile')} onClick={() => handleNavigate('profile')}>
            <User size={18} /> My Profile
          </div>
          <div style={getSidebarLinkStyle(currentTab === 'customers')} onClick={() => handleNavigate('customers')}>
            <Users size={18} /> Customers
          </div>
          <div style={getSidebarLinkStyle(currentTab === 'policies')} onClick={() => handleNavigate('policies')}>
            <FileCheck size={18} /> 
            <span style={{ flex: 1 }}>Client Policies</span>
            <span style={{ backgroundColor: '#059669', color: '#fff', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '1rem', fontWeight: 600 }}>Active</span>
          </div>
          <div style={getSidebarLinkStyle(currentTab === 'commissions')} onClick={() => handleNavigate('commissions')}>
            <BarChart3 size={18} /> Commissions
          </div>
        </nav>

        {/* Support & Sign Out */}
        <div style={{ paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '0 1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>Support</div>
          <div style={getSidebarLinkStyle(false)} onClick={() => alert('Agent Help Desk: Call 1800-123-4567 (Toll-Free)')}>
            <HelpCircle size={18} /> Underwriter Helpline
          </div>
          <div style={{ ...getSidebarLinkStyle(false), color: '#ef4444' }} onClick={() => { logout(); navigate('/login/agent', { replace: true }); }}>
            <LogOut size={18} /> Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', backgroundColor: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', width: '300px' }}>
              <Search size={16} />
              <input type="text" placeholder="Search anything..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }} />
              <span style={{ fontSize: '0.7rem', backgroundColor: '#e2e8f0', padding: '0.1rem 0.3rem', borderRadius: '0.25rem' }}>Ctrl + K</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '0.35rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              {backendStatus.checking ? <RefreshCw size={14} className="spin-animation" /> : backendStatus.online ? <Wifi size={14} /> : <WifiOff size={14} className="text-amber-500" />}
              Backend API: {backendStatus.checking ? 'Connecting...' : backendStatus.online ? 'Connected (Live)' : 'Disconnected'}
            </div>
            
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setShowUserMenu(!showUserMenu)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f766e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                {agentInitials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{user?.username || 'hello'}</span>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{user?.agent_id || 'ag333'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Routes */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <Routes>
            <Route path="profile" element={<AgentProfilePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:id" element={<CustomerViewPage />} />
            <Route
              path="policies"
              element={
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h2 className="dash-card-title">Policy Portfolio</h2>
                      <p className="dash-card-subtitle">Active client policies serviced under your Producer ID</p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="commissions"
              element={
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h2 className="dash-card-title">Commission &amp; Production Earnings</h2>
                      <p className="dash-card-subtitle">Monthly breakdown and direct deposit schedules</p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route index element={<Navigate to="profile" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
