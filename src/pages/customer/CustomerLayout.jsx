import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CustomerProfilePage from './CustomerProfilePage';

export default function CustomerLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/customer', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="app-layout">
      <header className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo-wrapper" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)' }}>
            <ShieldCheck className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">MASTERS COMPANION</span>
            <span className="brand-portal" style={{ backgroundColor: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
              Customer Portal
            </span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-profile-wrapper">
            <button type="button" className="user-profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar-initials" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)' }}>
                {(user?.username || 'C').slice(0, 2).toUpperCase()}
              </div>
              <div className="user-text-info">
                <span className="user-name">{user?.username || 'Customer'}</span>
                <span className="user-role" style={{ color: '#4338ca' }}>{user?.customer_id || 'Insured'}</span>
              </div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown-menu">
                <button className="dropdown-item text-rose-600 hover:bg-rose-50" onClick={() => { logout(); navigate('/login/customer', { replace: true }); }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-main-layout">
        <aside className="sidebar-container">
          <div className="sidebar-section-title">CUSTOMER MENU</div>
          <nav className="sidebar-nav">
            <button className="sidebar-link active">
              <span className="sidebar-link-icon"><User size={19} /></span>
              <span className="sidebar-link-label">My Profile</span>
            </button>
          </nav>
        </aside>

        <main className="app-content-area">
          <Routes>
            <Route path="profile" element={<CustomerProfilePage />} />
            <Route index element={<Navigate to="profile" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
