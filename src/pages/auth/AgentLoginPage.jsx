import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { agentLogin } from '../../services/api';

export default function AgentLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await agentLogin({
        username: form.username.trim(),
        password: form.password,
      });

      const token = res.data?.access || res.data?.token;
      const agentData = res.data?.agent || { username: form.username.trim() };
      const userObj = {
        ...agentData,
        name: agentData.username || form.username.trim(),
        role: 'Agent',
      };

      await login(token, userObj);
      navigate('/agent/profile', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err.message ||
        'Invalid agent credentials. Please verify and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-site-page">
      {/* Top bar */}
      <div className="admin-login-topbar">
        <Link to="/" className="admin-login-brand-link">
          <div className="site-brand-icon-sm">MC</div>
          <span className="admin-login-brand-name">MASTERS COMPANION</span>
        </Link>
        <Link to="/login" className="admin-login-back">
          ← Other Login Options
        </Link>
      </div>

      <div className="admin-login-container">
        <div className="admin-login-split">
          {/* Left Panel */}
          <div
            className="admin-login-left"
            style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
            }}
          >
            <div className="admin-login-left-content">
              <div
                className="admin-login-badge"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#a7f3d0',
                }}
              >
                👤 Licensed Agent Portal
              </div>
              <h1 className="admin-login-left-title">
                Welcome to<br />
                <span>Masters Companion</span><br />
                Producer Center
              </h1>
              <p className="admin-login-left-desc">
                Your direct portal to managing policyholder books, monitoring production volume,
                servicing renewals, and tracking commission earnings seamlessly.
              </p>
              <div className="admin-login-features">
                {[
                  '📈 Real-time policy portfolio tracking',
                  '⚡ Fast policy issuance & renewal workflows',
                  '💰 Transparent commission statements',
                  '🛡️ Direct underwriting communication channel',
                ].map((f) => (
                  <div key={f} className="admin-login-feature">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="admin-login-right">
            <div className="admin-login-form-card">
              <div className="admin-login-form-header">
                <h2>Agent Sign In</h2>
                <p>Enter your producer credentials to access your portal</p>
              </div>

              {error && (
                <div className="admin-login-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="admin-login-field">
                  <label htmlFor="username">Agent Username</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon">👤</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="e.g. john_agent"
                      autoComplete="username"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="admin-login-field">
                  <label htmlFor="password">Password</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon">🔒</span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter agent password"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="admin-login-toggle-pw"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="admin-login-submit"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.28)',
                  }}
                  disabled={loading}
                >
                  {loading ? <span className="admin-login-spinner" /> : 'Sign In as Agent →'}
                </button>
              </form>

              <div className="admin-login-form-footer">
                <Link to="/login" className="admin-login-switch-link">
                  ← Not an agent? Choose another login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-login-site-footer">
        <p>
          © {new Date().getFullYear()} Masters Companion Insurance Pvt. Ltd. · IRDAI Licence No. 124
        </p>
      </div>
    </div>
  );
}
