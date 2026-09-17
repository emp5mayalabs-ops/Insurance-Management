import { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, Hash, ShieldCheck, ShieldAlert, 
  Calendar, CheckCircle, XCircle, RefreshCw, Copy, 
  Check, Award, FileText, TrendingUp, Shield
} from 'lucide-react';
import { getAgentMe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AgentProfilePage() {
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAgentMe();
      if (res && res.agent) {
        setAgent(res.agent);
      } else if (res && res.data?.agent) {
        setAgent(res.data.agent);
      } else {
        setAgent(res);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Fallback to auth context user if API failed or offline
      if (user) {
        setAgent({
          id: user.id || 5,
          username: user.username || 'john_agent',
          email: user.email || 'john@example.com',
          agent_id: user.agent_id || 'AGT-001',
          phone: user.phone || '9876543210',
          is_active: user.is_active !== undefined ? user.is_active : true,
          is_user_active: user.is_user_active !== undefined ? user.is_user_active : true,
          created_at: user.created_at || '2026-09-17T10:15:30Z',
        });
      }
      setError(err.message || 'Unable to fetch latest profile from server.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const displayAgent = agent || user || {
    id: 5,
    username: 'john_agent',
    email: 'john@example.com',
    agent_id: 'AGT-001',
    phone: '9876543210',
    is_active: true,
    is_user_active: true,
    created_at: '2026-09-17T10:15:30Z',
  };

  const initials = (displayAgent.username || 'AG')
    .split('_')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-content">
      {/* Top Header Row */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Agent Portal</span>
            <span>/</span>
            <span className="text-emerald-600">My Profile</span>
          </div>
          <h1 className="page-title">Agent Profile &amp; Credentials</h1>
          <p className="page-subtitle">
            Verified producer information, licensing authority, and direct contact records
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchProfile}
            disabled={loading}
            title="Reload agent profile data from /api/agent/me/"
          >
            <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
            <span>{loading ? 'Syncing...' : 'Sync Profile'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚠️</span>
            <span>{error} (Displaying cached session data)</span>
          </div>
          <button
            type="button"
            onClick={fetchProfile}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b91c1c',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Profile Hero Banner */}
      <div
        className="dash-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          borderColor: '#bbf7d0',
          marginBottom: '1.75rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                color: '#ffffff',
                fontSize: '1.8rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px -5px rgba(5, 150, 105, 0.4)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            {/* Header info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {displayAgent.username}
                </h2>
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Hash size={13} /> {displayAgent.agent_id}
                </span>
              </div>

              <p style={{ margin: '0.35rem 0 0.65rem', color: '#64748b', fontSize: '0.95rem' }}>
                Masters Companion Certified Insurance Producer · IRDAI Licensee
              </p>

              {/* Status Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {displayAgent.is_active ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: '#d1fae5',
                      color: '#047857',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)',
                      }}
                    />
                    Active Producer
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    <XCircle size={14} /> Inactive Status
                  </span>
                )}

                {displayAgent.is_user_active ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle size={14} /> User Login Active
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    <ShieldAlert size={14} /> User Suspended
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Member Since Badge */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              textAlign: 'right',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Producer Since
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {formatDate(displayAgent.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details Table & Side Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }}>
        {/* Left Column: Full Account Information */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h2 className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} className="text-emerald-600" />
                Verified Agent Profile Details
              </h2>
              <p className="dash-card-subtitle">
                Official registration and identity parameters returned from{' '}
                <code style={{ background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                  /api/agent/me/
                </code>
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
            }}
          >
            {/* Agent ID */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Hash size={14} /> Agent ID
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayAgent.agent_id, 'agent_id')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title="Copy Agent ID"
                >
                  {copiedKey === 'agent_id' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
              <div style={{ marginTop: '0.35rem', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', color: '#047857' }}>
                {displayAgent.agent_id || 'N/A'}
              </div>
            </div>

            {/* Username */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} /> Username
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayAgent.username, 'username')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title="Copy Username"
                >
                  {copiedKey === 'username' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
              <div style={{ marginTop: '0.35rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                {displayAgent.username || 'N/A'}
              </div>
            </div>

            {/* Email Address */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} /> Email Address
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayAgent.email, 'email')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title="Copy Email"
                >
                  {copiedKey === 'email' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <a
                  href={`mailto:${displayAgent.email}`}
                  style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}
                >
                  {displayAgent.email || 'N/A'}
                </a>
              </div>
            </div>

            {/* Phone Number */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} /> Phone Number
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(displayAgent.phone, 'phone')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  title="Copy Phone"
                >
                  {copiedKey === 'phone' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                <a
                  href={`tel:${displayAgent.phone}`}
                  style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}
                >
                  {displayAgent.phone || 'N/A'}
                </a>
              </div>
            </div>

            {/* Agent Licensing Status */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'block' }}>
                Licensing Authority (is_active)
              </span>
              <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {displayAgent.is_active ? (
                  <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={16} /> Fully Licensed &amp; Active
                  </span>
                ) : (
                  <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={16} /> Inactive / Suspended
                  </span>
                )}
              </div>
            </div>

            {/* User Account Status */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'block' }}>
                System User Account (is_user_active)
              </span>
              <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {displayAgent.is_user_active ? (
                  <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={16} /> Login Access Enabled
                  </span>
                ) : (
                  <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldAlert size={16} /> Account Access Revoked
                  </span>
                )}
              </div>
            </div>

            {/* Account Created At */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> Created At
              </span>
              <div style={{ marginTop: '0.35rem', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                {formatDate(displayAgent.created_at)}
              </div>
            </div>

            {/* Database ID */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Hash size={14} /> Internal Database ID
              </span>
              <div style={{ marginTop: '0.35rem', fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>
                #{displayAgent.id || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Standing, Commission Tier & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Standing Card */}
          <div className="dash-card">
            <h3 className="dash-card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Award size={18} className="text-amber-500" />
              Producer Standing
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Designation</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Senior Agent</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Agency Network</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e3a8a' }}>Masters Companion</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Commission Tier</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>Tier 1 (18.5%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>IRDAI Compliance</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={14} /> Certified
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dash-card">
            <h3 className="dash-card-title" style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <TrendingUp size={18} className="text-blue-600" />
              Agent Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                }}
                onClick={() => alert('Policy binding module: Access client directory to issue a new cover note.')}
              >
                <FileText size={16} /> Issue New Policy
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => copyToClipboard(JSON.stringify(displayAgent, null, 2), 'json')}
              >
                {copiedKey === 'json' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedKey === 'json' ? 'Copied JSON!' : 'Copy Agent JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
