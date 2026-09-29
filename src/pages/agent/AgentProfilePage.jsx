import { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, ShieldCheck, Award, FileText,
  CheckCircle, Users, DollarSign, HelpCircle, Edit3, Camera
} from 'lucide-react';
import { getAgentMe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const s = {
  page: { padding: '0' },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  breadcrumbIcon: { color: '#3b82f6', display: 'flex', alignItems: 'center' },
  breadcrumbActive: { color: '#3b82f6', fontWeight: 600 },
  breadcrumbSep: { color: '#94a3b8' },
  pageTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 },
  pageSubtitle: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },
  editBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  
  topGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  
  cardBody: { padding: '24px' },
  
  profileHero: { display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: '88px', height: '88px', borderRadius: '50%', backgroundColor: '#0f766e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 700 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3b82f6', color: '#fff', border: '2px solid #fff', borderRadius: '50%', padding: '4px', display: 'flex', cursor: 'pointer' },
  
  name: { fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 },
  agentId: { color: '#0f766e', fontWeight: 600, fontSize: '14px', margin: '2px 0' },
  agentDesc: { color: '#64748b', fontSize: '13px', margin: 0 },
  
  activeBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 },
  
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  infoLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', fontWeight: 500 },
  infoIconWrap: { backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '4px', display: 'flex' },
  infoValue: { fontWeight: 600, color: '#1e293b', fontSize: '13px' },
  
  verifiedBar: { backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  verifiedLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  verifiedIconWrap: { backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px', padding: '6px', display: 'flex' },
  verifiedTitle: { fontWeight: 600, color: '#16a34a', fontSize: '13px' },
  verifiedSub: { fontSize: '11px', color: '#4ade80' },
  
  prodInfoCard: { padding: '24px', height: '100%', boxSizing: 'border-box' },
  prodInfoTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a', fontSize: '15px', marginBottom: '20px' },
  prodIconWrap: { backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '8px', padding: '6px', display: 'flex' },
  prodRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
  prodLabel: { fontSize: '13px', color: '#64748b' },
  prodValue: { fontSize: '13px', fontWeight: 600, color: '#1e293b' },
  
  qaTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '16px' },
  qaIconWrap: { backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '6px', padding: '6px', display: 'flex' },
  qaButtons: { display: 'flex', gap: '8px' },
  qaOutlineBtn: { flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', color: '#3b82f6', fontWeight: 600, fontSize: '12px', cursor: 'pointer' },
  qaFilledBtn: { flex: 1, padding: '8px 12px', border: 'none', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer' },
  
  statGrid: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' },
  statItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  statIconWrap: { backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '8px', padding: '8px', display: 'flex' },
  statIconWrapGreen: { backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', padding: '8px', display: 'flex' },
  statLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: 500 },
  statValue: { fontSize: '15px', fontWeight: 700, color: '#0f172a' },
  statDivider: { width: '1px', height: '36px', backgroundColor: '#f1f5f9' },
  
  supportText: { fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: 1.5 },
  supportBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#3b82f6', backgroundColor: '#eff6ff', cursor: 'pointer', fontWeight: 600, fontSize: '12px' },
};

export default function AgentProfilePage() {
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getAgentMe();
      if (res && res.agent) setAgent(res.agent);
      else if (res && res.data?.agent) setAgent(res.data.agent);
      else setAgent(res);
    } catch (err) {
      if (user) {
        setAgent({
          id: user.id || 5,
          username: user.username || 'hello',
          email: user.email || 'hello@gmail.com',
          agent_id: user.agent_id || 'ag333',
          phone: user.phone || '87654323456',
          is_active: user.is_active !== undefined ? user.is_active : true,
          created_at: user.created_at || '2026-09-25T13:12:00Z',
        });
      }
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch { return isoString; }
  };

  const displayAgent = agent || user || {
    username: 'hello', email: 'hello@gmail.com', agent_id: 'ag333',
    phone: '87654323456', is_active: true, created_at: '2026-09-25T13:12:00Z',
  };

  const initials = (displayAgent.username || 'A').slice(0, 1).toUpperCase();

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <div style={s.breadcrumb}>
            <span style={s.breadcrumbIcon}><User size={12} /></span>
            <span>Agent Portal</span>
            <span style={s.breadcrumbSep}>&gt;</span>
            <span style={s.breadcrumbActive}>My Profile</span>
          </div>
          <h1 style={s.pageTitle}>My Profile</h1>
          <p style={s.pageSubtitle}>Manage your profile information, view credentials and account details.</p>
        </div>
        <button style={s.editBtn}>
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      {/* Top Grid: Profile Card + Producer Info */}
      <div style={s.topGrid}>
        <div style={s.card}>
          <div style={s.cardBody}>
            {/* Hero */}
            <div style={s.profileHero}>
              <div style={s.avatarWrap}>
                <div style={s.avatar}>{initials}</div>
                <div style={s.cameraBtn}><Camera size={12} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={s.name}>{displayAgent.username}</h2>
                  {displayAgent.is_active && (
                    <span style={s.activeBadge}><ShieldCheck size={11} /> Active Producer</span>
                  )}
                </div>
                <div style={s.agentId}>{displayAgent.agent_id}</div>
                <div style={s.agentDesc}>Masters Companion Certified Insurance Producer</div>
                <div style={s.agentDesc}>IRDAI Licensee</div>
              </div>
            </div>

            {/* Info Row */}
            <div style={s.infoGrid}>
              <div style={s.infoItem}>
                <span style={s.infoLabel}><span style={s.infoIconWrap}><ShieldCheck size={13} color="#64748b" /></span> Agent ID</span>
                <span style={s.infoValue}>{displayAgent.agent_id}</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}><span style={s.infoIconWrap}><User size={13} color="#64748b" /></span> Username</span>
                <span style={s.infoValue}>{displayAgent.username}</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}><span style={s.infoIconWrap}><Mail size={13} color="#64748b" /></span> Email</span>
                <span style={s.infoValue}>{displayAgent.email}</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}><span style={s.infoIconWrap}><Phone size={13} color="#64748b" /></span> Phone</span>
                <span style={s.infoValue}>{displayAgent.phone}</span>
              </div>
            </div>
          </div>

          {/* Verified bar */}
          <div style={s.verifiedBar}>
            <div style={s.verifiedLeft}>
              <div style={s.verifiedIconWrap}><ShieldCheck size={18} /></div>
              <div>
                <div style={s.verifiedTitle}>Your profile is verified</div>
                <div style={s.verifiedSub}>Registration and identity parameters are verified from /api/agent/me/</div>
              </div>
            </div>
            <CheckCircle size={20} color="#16a34a" />
          </div>
        </div>

        {/* Producer Information */}
        <div style={s.card}>
          <div style={s.prodInfoCard}>
            <div style={s.prodInfoTitle}>
              <span style={s.prodIconWrap}><Award size={17} /></span>
              Producer Information
            </div>
            {[
              ['Designation', 'Senior Agent'],
              ['Agency Network', 'Masters Companion'],
              ['Commission Tier', 'Tier 1 (18.5%)'],
              ['Joined On', formatDate(displayAgent.created_at)],
            ].map(([label, value], i, arr) => (
              <div key={label} style={{ ...s.prodRow, borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={s.prodLabel}>{label}</span>
                <span style={s.prodValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={s.bottomGrid}>
        {/* Quick Actions */}
        <div style={s.card}>
          <div style={s.cardBody}>
            <div style={s.qaTitle}><span style={s.qaIconWrap}><FileText size={15} /></span> Quick Actions</div>
            <div style={s.qaButtons}>
              <button style={s.qaOutlineBtn} onClick={() => navigate('/agent/policies')}>View Policies</button>
              <button style={s.qaFilledBtn} onClick={() => navigate('/agent/commissions')}>Check Commissions</button>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div style={s.card}>
          <div style={s.cardBody}>
            <div style={s.qaTitle}><span style={s.qaIconWrap}><Award size={15} /></span> Profile Stats</div>
            <div style={s.statGrid}>
              <div style={s.statItem}>
                <span style={s.statIconWrap}><Users size={17} /></span>
                <div>
                  <div style={s.statLabel}>Total Customers</div>
                  <div style={s.statValue}>248</div>
                </div>
              </div>
              <div style={s.statDivider} />
              <div style={s.statItem}>
                <span style={s.statIconWrapGreen}><FileText size={17} /></span>
                <div>
                  <div style={s.statLabel}>Active Policies</div>
                  <div style={s.statValue}>182</div>
                </div>
              </div>
              <div style={s.statDivider} />
              <div style={s.statItem}>
                <span style={s.statIconWrapGreen}><DollarSign size={17} /></span>
                <div>
                  <div style={s.statLabel}>Total Commissions</div>
                  <div style={s.statValue}>₹ 1,24,500</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div style={s.card}>
          <div style={s.cardBody}>
            <div style={s.qaTitle}><span style={s.qaIconWrap}><HelpCircle size={15} /></span> Support</div>
            <p style={s.supportText}>Need help? Contact our underwriter helpline for any assistance or queries.</p>
            <button style={s.supportBtn}><Phone size={13} /> Underwriter Helpline</button>
          </div>
        </div>
      </div>
    </div>
  );
}
