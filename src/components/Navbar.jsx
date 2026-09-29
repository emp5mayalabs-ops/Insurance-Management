import { useState, useEffect } from 'react';
import { Wifi, WifiOff, LogOut, RefreshCw, Server, Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkBackendStatus, getBaseUrl } from '../services/api';

export default function Navbar({ onNavigate, currentTab }) {
  const { user, logout } = useAuth();
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const currentUrl = getBaseUrl();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const verifyBackend = async () => {
    setBackendStatus(prev => ({ ...prev, checking: true }));
    const result = await checkBackendStatus();
    setBackendStatus({ online: result.online, checking: false, url: result.url, error: result.error });
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 20000);
    return () => clearInterval(interval);
  }, []);

  const agentInitials = (user?.username || 'AD').slice(0, 2).toUpperCase();

  return (
    <>
      <header style={{ height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', zIndex: 10, flexShrink: 0 }}>
        {/* Left: Menu + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 0 }}>
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '7px 12px', borderRadius: '8px', width: '300px' }}>
            <Search size={15} color="#94a3b8" />
            <input type="text" placeholder="Search anything..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#374151' }} />
            <span style={{ fontSize: '10px', backgroundColor: '#e2e8f0', padding: '2px 5px', borderRadius: '4px', color: '#64748b', whiteSpace: 'nowrap' }}>Ctrl + K</span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Backend status */}
          <button
            onClick={() => setShowConfigModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: backendStatus.online ? '#ecfdf5' : '#fef3c7', color: backendStatus.online ? '#059669' : '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            {backendStatus.checking ? <RefreshCw size={13} /> : backendStatus.online ? <Wifi size={13} /> : <WifiOff size={13} />}
            Backend API: {backendStatus.checking ? 'Connecting...' : backendStatus.online ? 'Connected (Live)' : 'Disconnected'}
          </button>

          {/* Bell */}
          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, display: 'flex' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
          </button>

          {/* User */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setShowUserMenu(!showUserMenu)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                {agentInitials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{user?.username || 'Admin'}</span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{user?.role || 'Administrator'}</span>
              </div>
            </div>

            {showUserMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '8px 0', zIndex: 100 }}>
                <div style={{ padding: '8px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{user?.name || 'Administrator'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{user?.email || 'admin@masterscompanion.in'}</div>
                </div>
                <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#374151' }} onClick={() => { setShowConfigModal(true); setShowUserMenu(false); }}>
                  <Server size={14} /> Backend Settings
                </button>
                <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#ef4444' }} onClick={() => { setShowUserMenu(false); logout(); }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backend Config Modal - keep existing */}
      {showConfigModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowConfigModal(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '500px', maxWidth: '90vw', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '8px', borderRadius: '8px', display: 'flex' }}><Server size={18} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>API Backend Configuration</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Configure backend server address</div>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }} onClick={() => setShowConfigModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Backend Health:</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: backendStatus.online ? '#16a34a' : '#dc2626', backgroundColor: backendStatus.online ? '#dcfce7' : '#fee2e2', padding: '3px 10px', borderRadius: '20px' }}>
                    {backendStatus.online ? 'Online & Connected' : 'Server Offline'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                  {backendStatus.online ? `Responding at ${currentUrl}` : `Not responding at ${currentUrl}`}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Active Backend URL (VITE_API_URL)</label>
                <input type="text" value={currentUrl} readOnly style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'monospace', backgroundColor: '#f8fafc', color: '#64748b', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
              <button style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }} onClick={() => setShowConfigModal(false)}>Close</button>
              <button style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={verifyBackend}>
                <RefreshCw size={13} /> Re-check Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
