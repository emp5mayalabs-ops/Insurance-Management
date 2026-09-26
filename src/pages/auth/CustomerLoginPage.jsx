import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerLogin } from '../../services/api';

export default function CustomerLoginPage() {
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
      const res = await customerLogin({
        username: form.username.trim(),
        password: form.password,
      });

      const token = res.data?.access || res.data?.token;
      const customerData = res.data?.customer || { username: form.username.trim() };
      const userObj = {
        ...customerData,
        name: customerData.username || form.username.trim(),
        role: 'Customer',
      };

      await login(token, userObj);
      navigate('/customer/profile', { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="admin-login-container">
        <div className="admin-login-split">
          <div className="admin-login-left" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)' }}>
            <div className="admin-login-left-content">
              <div className="admin-login-badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#bfdbfe' }}>
                👤 Customer Portal
              </div>
              <h1 className="admin-login-left-title">
                Welcome to<br />
                <span>Masters Companion</span>
              </h1>
              <p className="admin-login-left-desc">
                Your direct portal to view policy details, manage your profile, and request support.
              </p>
            </div>
          </div>

          <div className="admin-login-right">
            <div className="admin-login-form-card">
              <div className="admin-login-form-header">
                <h2>Customer Sign In</h2>
                <p>Enter your credentials to access your portal</p>
              </div>

              {error && <div className="admin-login-error"><span>⚠️</span> {error}</div>}

              <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="admin-login-field">
                  <label htmlFor="username">Username</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon">👤</span>
                    <input
                      id="username" name="username" type="text"
                      value={form.username} onChange={handleChange}
                      placeholder="e.g. ravi_cust" disabled={loading}
                    />
                  </div>
                </div>

                <div className="admin-login-field">
                  <label htmlFor="password">Password</label>
                  <div className="admin-login-input-wrap">
                    <span className="admin-login-input-icon">🔒</span>
                    <input
                      id="password" name="password" type={showPassword ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      placeholder="Enter password" disabled={loading}
                    />
                    <button
                      type="button" className="admin-login-toggle-pw"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="admin-login-submit" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #3b82f6 100%)' }} disabled={loading}>
                  {loading ? <span className="admin-login-spinner" /> : 'Sign In →'}
                </button>
              </form>

              <div className="admin-login-form-footer">
                <Link to="/login" className="admin-login-switch-link">
                  ← Not a customer? Choose another login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
