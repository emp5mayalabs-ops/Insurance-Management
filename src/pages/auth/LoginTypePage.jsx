import { Link } from 'react-router-dom';

const loginTypes = [
  {
    to: '/login/admin',
    icon: '🛡️',
    label: 'Admin Login',
    desc: 'Portal management, agent oversight, reporting &amp; system configuration.',
    color: '#1e40af',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
  },
  {
    to: '/login/agent',
    icon: '👤',
    label: 'Agent Login',
    desc: 'Manage your client portfolio, issue policies, and track commissions.',
    color: '#065f46',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
  },
  {
    to: '/login/customer',
    icon: '🏠',
    label: 'Customer Login',
    desc: 'View your policies, download certificates, and raise claim requests.',
    color: '#7c2d12',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 100%)',
  },
];

export default function LoginTypePage() {
  return (
    <div className="login-type-page">
      {/* Back to site */}
      <div className="login-type-topbar">
        <Link to="/" className="login-type-back">
          ← Back to Masters Companion
        </Link>
      </div>

      <div className="login-type-container">
        {/* Header */}
        <div className="login-type-header">
          <Link to="/" className="login-type-brand">
            <div className="site-brand-icon">MC</div>
            <div>
              <div className="login-type-brand-name">MASTERS COMPANION</div>
              <div className="login-type-brand-sub">Insurance &amp; Financial Services</div>
            </div>
          </Link>
          <h1 className="login-type-title">Welcome Back</h1>
          <p className="login-type-sub">Please select your account type to continue</p>
        </div>

        {/* Cards */}
        <div className="login-type-cards">
          {loginTypes.map((lt) => (
            <Link key={lt.label} to={lt.to} className="login-type-card" style={{ '--lt-bg': lt.bg }}>
              <div className="login-type-card-icon">{lt.icon}</div>
              <h3 className="login-type-card-label">{lt.label}</h3>
              {/* Using a span to avoid rendering HTML entities inside a <p> from dangerouslySetInnerHTML */}
              <p className="login-type-card-desc">{lt.label === 'Admin Login'
                ? 'Portal management, agent oversight, reporting & system configuration.'
                : lt.label === 'Agent Login'
                ? 'Manage your client portfolio, issue policies, and track commissions.'
                : 'View your policies, download certificates, and raise claim requests.'
              }</p>
              <span className="login-type-card-cta">Login as {lt.label.split(' ')[0]} →</span>
            </Link>
          ))}
        </div>

        <p className="login-type-footer-note">
          Need help? Call <strong>1800-123-4567</strong> (Toll Free) · Mon–Sat 9 AM–7 PM
        </p>
      </div>
    </div>
  );
}
