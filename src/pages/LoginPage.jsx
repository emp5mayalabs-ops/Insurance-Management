import { useState, useEffect } from 'react';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkBackendStatus } from '../services/api';

export default function LoginPage() {
  const { login, loading, authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState('');
  const [backendInfo, setBackendInfo] = useState({ online: false, checking: true });

  useEffect(() => {
    checkBackendStatus().then((res) => {
      setBackendInfo({ online: res.online, checking: false });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim()) {
      setLocalError('Please enter your administrator username or email.');
      return;
    }
    if (!password.trim()) {
      setLocalError('Please enter your password.');
      return;
    }

    try {
      await login({ username: username.trim(), password });
    } catch (err) {
      setLocalError(err.message || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-card-container">
        {/* Left Side: Insurance Brand Showcase */}
        <div className="login-brand-panel">
          <div className="brand-panel-content">
            <div className="brand-logo-large">
              <Shield size={36} className="brand-shield-svg" />
            </div>
            <h1 className="brand-title">InsureSecure</h1>
            <p className="brand-tagline">
              Enterprise Policy Underwriting & Agent Fleet Administration Portal
            </p>

            <div className="brand-feature-list">
              <div className="brand-feature-item">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Real-time Agent Commission & Policy Lifecycle Tracking</span>
              </div>
              <div className="brand-feature-item">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Instant Agent License Verification & Status Controls</span>
              </div>
              <div className="brand-feature-item">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>End-to-End REST API Synchronization</span>
              </div>
            </div>

            <div className="brand-footer-pill">
              <Server size={14} />
              <span>Backend Status: {backendInfo.checking ? 'Testing...' : backendInfo.online ? 'Online' : 'Standby / Fallback'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-panel">
          <div className="login-header-group">
            <h2 className="login-heading">Admin Sign In</h2>
            <p className="login-subheading">
              Access the executive insurance administration console
            </p>
          </div>

          {(localError || authError) && (
            <div className="login-alert-box">
              <AlertCircle size={18} className="alert-icon" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username or Email
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-prefix-icon" />
                <input
                  id="username"
                  type="text"
                  className="form-input with-prefix"
                  placeholder="admin or admin@masterscompanion.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-prefix-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input with-prefix with-suffix"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Sign in to Portal <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-disclaimer">
            Masters Companion Corp. Licensed under NAIC Insurance Regulatory Compliance Standards.
          </div>
        </div>
      </div>
    </div>
  );
}
