import { Link } from 'react-router-dom';

export default function AgentLoginPage() {
  return (
    <div className="admin-login-site-page">
      <div className="admin-login-topbar">
        <Link to="/" className="admin-login-brand-link">
          <div className="site-brand-icon-sm">MC</div>
          <span className="admin-login-brand-name">MASTERS COMPANION</span>
        </Link>
        <Link to="/login" className="admin-login-back">
          ← Other Login Options
        </Link>
      </div>
      <div className="admin-login-container" style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div className="admin-login-form-card" style={{ maxWidth: 440, width: '100%', margin: '2rem auto' }}>
          <div className="admin-login-form-header">
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👤</div>
            <h2>Agent Portal</h2>
            <p>The agent login portal is coming soon. Contact your administrator for access.</p>
          </div>
          <Link to="/login" className="admin-login-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '1.5rem' }}>
            ← Back to Login Options
          </Link>
        </div>
      </div>
      <div className="admin-login-site-footer">
        <p>© {new Date().getFullYear()} Masters Companion Insurance Pvt. Ltd.</p>
      </div>
    </div>
  );
}
