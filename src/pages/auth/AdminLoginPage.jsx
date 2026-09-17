import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';

export default function AdminLoginPage() {
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
      console.log('Submitting credentials:', { username: form.username.trim(), password: form.password });
      const res = await adminLogin({ username: form.username.trim(), password: form.password });
      const token = res.data?.token || res.data?.access || res.data?.key;
      const user = res.data?.user || { username: form.username };
      login(token, user);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Invalid credentials. Please try again.';
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
          <div className="admin-login-left">
            <div className="admin-login-left-content">
              <div className="admin-login-badge">🛡️ Secure Admin Portal</div>
              <h1 className="admin-login-left-title">
                Welcome to<br />
                <span>Masters Companion</span><br />
                Admin Panel
              </h1>
              <p className="admin-login-left-desc">
                The administrative backbone of Masters Companion. Manage agents, monitor
                performance, oversee policy operations, and drive business growth from one
                unified dashboard.
              </p>
              <div className="admin-login-features">
                {[
                  '📊 Real-time business analytics',
                  '👥 Agent lifecycle management',
                  '📋 Policy & claims oversight',
                  '🔐 Role-based access control',
                ].map((f) => (
                  <div key={f} className="admin-login-feature">{f}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="admin-login-right">
            <div className="admin-login-form-card">
              <div className="admin-login-form-header">
                <h2>Admin Sign In</h2>
                <p>Enter your administrator credentials to access the portal</p>
              </div>

              {error && (
                <div className="admin-login-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="admin-login-field">
                  <label htmlFor="username">Username</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon">👤</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Enter admin username"
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
                      placeholder="Enter password"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="admin-login-toggle-pw"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="admin-login-submit" disabled={loading}>
                  {loading ? (
                    <span className="admin-login-spinner" />
                  ) : (
                    'Sign In to Portal →'
                  )}
                </button>
              </form>

              <div className="admin-login-form-footer">
                <Link to="/login" className="admin-login-switch-link">
                  ← Not an admin? Choose another login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-login-site-footer">
        <p>© {new Date().getFullYear()} Masters Companion Insurance Pvt. Ltd. · IRDAI Licence No. 124</p>
      </div>
    </div>
  );
}
