import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, ShieldCheck, FileCheck, BarChart3, 
  LogOut, Wifi, WifiOff, RefreshCw, Server, HelpCircle, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkBackendStatus, getBaseUrl } from '../../services/api';
import AgentProfilePage from './AgentProfilePage';

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

  return (
    <div className="app-layout">
      {/* Agent Top Navbar */}
      <header className="navbar-container">
        {/* Brand Left */}
        <div className="navbar-brand">
          <div
            className="brand-logo-wrapper"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            }}
          >
            <ShieldCheck className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">MASTERS COMPANION</span>
            <span
              className="brand-portal"
              style={{
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '0.1rem 0.45rem',
                borderRadius: '4px',
              }}
            >
              Agent Portal
            </span>
          </div>
        </div>

        {/* Center / Backend Connection Status */}
        <div className="navbar-center">
          <div
            className={`backend-pill ${backendStatus.online ? 'online' : 'offline'}`}
            title={`Backend URL: ${getBaseUrl()}`}
          >
            {backendStatus.checking ? (
              <RefreshCw size={14} className="spin-animation text-slate-400" />
            ) : backendStatus.online ? (
              <Wifi size={14} className="text-emerald-500" />
            ) : (
              <WifiOff size={14} className="text-amber-500" />
            )}
            <span className="backend-pill-text">
              Backend API:{' '}
              <strong>
                {backendStatus.checking
                  ? 'Connecting...'
                  : backendStatus.online
                  ? 'Connected (Live)'
                  : 'Disconnected'}
              </strong>
            </span>
            <span className="backend-pill-badge">GET /api/agent/me/</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-right">
          {/* Quick link navigation */}
          <div className="nav-tabs-quick">
            <button
              className={`nav-tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavigate('profile')}
            >
              My Profile
            </button>
            <button
              className={`nav-tab-btn ${currentTab === 'policies' ? 'active' : ''}`}
              onClick={() => handleNavigate('policies')}
            >
              My Policies
            </button>
            <button
              className={`nav-tab-btn ${currentTab === 'commissions' ? 'active' : ''}`}
              onClick={() => handleNavigate('commissions')}
            >
              Commissions
            </button>
          </div>

          {/* User Profile dropdown */}
          <div className="user-profile-wrapper">
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div
                className="user-avatar-initials"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                }}
              >
                {agentInitials}
              </div>
              <div className="user-text-info">
                <span className="user-name">{user?.username || 'Agent'}</span>
                <span className="user-role" style={{ color: '#059669' }}>
                  {user?.agent_id || 'Licensed Agent'}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-header">
                  <div className="font-semibold text-slate-900">{user?.username || 'Agent'}</div>
                  <div className="text-xs text-slate-500">{user?.email || 'agent@masterscompanion.in'}</div>
                  <div className="text-xs font-mono text-emerald-700 mt-1 font-bold">
                    {user?.agent_id ? `ID: ${user.agent_id}` : ''}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleNavigate('profile');
                    setShowUserMenu(false);
                  }}
                >
                  <User size={15} /> My Profile
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate('/login/agent', { replace: true });
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="app-main-layout">
        {/* Agent Sidebar */}
        <aside className="sidebar-container">
          <div className="sidebar-section-title">AGENT WORKSPACE</div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-link ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavigate('profile')}
            >
              <span className="sidebar-link-icon">
                <User size={19} />
              </span>
              <span className="sidebar-link-label">My Profile</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                }}
              >
                {user?.agent_id || 'ME'}
              </span>
            </button>

            <button
              type="button"
              className={`sidebar-link ${currentTab === 'policies' ? 'active' : ''}`}
              onClick={() => handleNavigate('policies')}
            >
              <span className="sidebar-link-icon">
                <FileCheck size={19} />
              </span>
              <span className="sidebar-link-label">Client Policies</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.72rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  fontWeight: 700,
                }}
              >
                Active
              </span>
            </button>

            <button
              type="button"
              className={`sidebar-link ${currentTab === 'commissions' ? 'active' : ''}`}
              onClick={() => handleNavigate('commissions')}
            >
              <span className="sidebar-link-icon">
                <BarChart3 size={19} />
              </span>
              <span className="sidebar-link-label">Commissions</span>
            </button>
          </nav>

          <div className="sidebar-section-title" style={{ marginTop: '2rem' }}>
            PRODUCER SUPPORT
          </div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className="sidebar-link"
              onClick={() => alert('Agent Help Desk: Call 1800-123-4567 (Toll-Free) or email underwrite@masterscompanion.in')}
            >
              <span className="sidebar-link-icon">
                <HelpCircle size={18} />
              </span>
              <span className="sidebar-link-label">Underwriter Helpline</span>
            </button>
            <button
              type="button"
              className="sidebar-link"
              onClick={() => {
                logout();
                navigate('/login/agent', { replace: true });
              }}
              style={{ color: '#ef4444' }}
            >
              <span className="sidebar-link-icon">
                <LogOut size={18} />
              </span>
              <span className="sidebar-link-label">Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="app-content-area">
          <Routes>
            <Route path="profile" element={<AgentProfilePage />} />
            <Route
              path="policies"
              element={
                <div className="dash-card">
                  <div className="dash-card-header">
                    <div>
                      <h2 className="dash-card-title">Policy Portfolio</h2>
                      <p className="dash-card-subtitle">Active client policies serviced under your Producer ID</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
                      onClick={() => handleNavigate('profile')}
                    >
                      View My Profile
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mt-3">
                    All policies issued under agent ID <strong>{user?.agent_id || 'AGT-001'}</strong> receive real-time premium updates and automated commission tracking.
                  </p>
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleNavigate('profile')}
                    >
                      Back to Profile
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm mt-3">
                    Commission tiers are synchronized monthly. Verified agent credentials ensure automatic disbursement upon policy underwriting completion.
                  </p>
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
