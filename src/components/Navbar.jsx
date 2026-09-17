import { useState, useEffect } from 'react';
import { 
  Shield, Wifi, WifiOff, LogOut, 
  RefreshCw, Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkBackendStatus, getBaseUrl } from '../services/api';

export default function Navbar({ onNavigate, currentTab }) {
  const { user, logout } = useAuth();
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const currentUrl = getBaseUrl();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const verifyBackend = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkBackendStatus();
    setBackendStatus({
      online: result.online,
      checking: false,
      url: result.url,
      error: result.error
    });
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="navbar-container">
        {/* Brand Left */}
        <div className="navbar-brand">
          <div className="brand-logo-wrapper">
            <Shield className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">MASTERS COMPANION</span>
            <span className="brand-portal">Admin Portal</span>
          </div>
        </div>

        {/* Center / Backend Connection Status Pill */}
        <div className="navbar-center">
          <button 
            type="button"
            className={`backend-pill ${backendStatus.online ? 'online' : 'offline'}`}
            onClick={() => setShowConfigModal(true)}
            title="Click to view or edit Backend API URL"
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
                  ? 'Pinging...'
                  : backendStatus.online
                  ? 'Connected (Live)'
                  : 'Disconnected'}
              </strong>
            </span>
            <span className="backend-pill-badge">GET /</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-right">
          {/* Quick link navigation if on mobile or compact */}
          <div className="nav-tabs-quick">
            <button
              className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-tab-btn ${currentTab === 'agents' ? 'active' : ''}`}
              onClick={() => onNavigate('agents')}
            >
              Agents Directory
            </button>
          </div>

          {/* User Profile dropdown */}
          <div className="user-profile-wrapper">
            <button
              type="button"
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar-initials">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="user-text-info">
                <span className="user-name">{user?.name || user?.username || 'Admin'}</span>
                <span className="user-role">{user?.role || 'Administrator'}</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-header">
                  <div className="font-semibold text-slate-900">{user?.name || 'Administrator'}</div>
                  <div className="text-xs text-slate-500">{user?.email || 'admin@insuresecure.com'}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowConfigModal(true);
                    setShowUserMenu(false);
                  }}
                >
                  <Server size={15} /> Backend Settings
                </button>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backend Configuration Modal */}
      {showConfigModal && (
        <div className="modal-backdrop" onClick={() => setShowConfigModal(false)}>
          <div className="modal-container config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-icon-badge">
                  <Server size={20} />
                </div>
                <div>
                  <h3>API Backend Configuration</h3>
                  <p className="modal-subtitle">Configure backend server address for insurance management endpoints</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowConfigModal(false)}>
                ✕
              </button>
            </div>

            <div className="form-body">
              <div className="backend-info-box">
                <div className="status-row">
                  <span className="text-sm text-slate-600 font-medium">Backend Health:</span>
                  <span className={`status-badge ${backendStatus.online ? 'active' : 'inactive'}`}>
                    {backendStatus.online ? 'Online & Connected' : 'Server Offline / Unreachable'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {backendStatus.online
                    ? `Backend server is responding to GET / requests at ${currentUrl}.`
                    : `Backend server at ${currentUrl} is not responding. Ensure your backend server is running and configured.`}
                </div>
              </div>

              <div className="form-group mt-4">
                <label className="form-label" htmlFor="backend_url">
                  Active Backend URL (From .env: VITE_API_URL)
                </label>
                <input
                  id="backend_url"
                  type="text"
                  className="form-input font-mono"
                  value={currentUrl}
                  readOnly
                  disabled
                />
                <span className="text-xs text-slate-500 mt-1">
                  To change this URL, update <code>VITE_API_URL</code> in your project's <code>.env</code> file.
                </span>
              </div>

              <div className="endpoints-reference">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Configured REST Endpoints
                </span>
                <div className="endpoint-tags">
                  <code>GET /</code>
                  <code>POST /api/admin/login/</code>
                  <code>GET /api/admin/agents/</code>
                  <code>POST /api/admin/agents/create/</code>
                  <code>GET /api/admin/agents/&lt;id&gt;/</code>
                  <code>PUT /api/admin/agents/&lt;id&gt;/update/</code>
                  <code>DELETE /api/admin/agents/&lt;id&gt;/delete/</code>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfigModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={verifyBackend}
              >
                <RefreshCw size={14} className={backendStatus.checking ? 'spin-animation' : ''} /> Re-check Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
