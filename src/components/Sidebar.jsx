import { LayoutDashboard, Users, ShieldAlert, FileCheck, BarChart3, ShieldCheck, LogOut } from 'lucide-react';

export default function Sidebar({ currentTab, onNavigate, agentCount = 0, activeCount = 0, onLogout }) {
  const getLinkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.7rem 1rem', margin: '0.15rem 0.75rem',
    borderRadius: '0.5rem', cursor: 'pointer',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#4f46e5' : 'transparent',
    fontWeight: isActive ? 600 : 500, fontSize: '0.875rem',
    border: 'none', width: 'calc(100% - 1.5rem)', textAlign: 'left',
    transition: 'background 0.15s'
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, badge: null },
    { id: 'agents', label: 'Insurance Agents', icon: <Users size={18} />, badge: `${activeCount}/${agentCount}` },
    { id: 'policies', label: 'Policies In-Force', icon: <ShieldCheck size={18} />, badge: '529' },
    { id: 'claims', label: 'Claims Settlement', icon: <ShieldAlert size={18} />, badge: '18' },
    { id: 'reports', label: 'Underwriting Reports', icon: <BarChart3 size={18} />, badge: null },
  ];

  return (
    <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh' }}>
      {/* Brand */}
      <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #334155', marginBottom: '0.75rem' }}>
        <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '6px', borderRadius: '6px', display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.5px', color: '#fff' }}>MASTERS COMPANION</span>
          <span style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.5px' }}>ADMIN PORTAL</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {menuItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button key={item.id} style={getLinkStyle(isActive)} onClick={() => onNavigate(item.id)}>
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#334155', color: isActive ? '#fff' : '#94a3b8', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 600 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ paddingBottom: '1rem', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
        <div style={{ padding: '0 1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>COMPLIANCE</div>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <FileCheck size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>Compliance Audit</div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.4, marginTop: 2 }}>All agents certified under IRDAI regulatory standards.</div>
            </div>
          </div>
        </div>
        <button
          style={{ ...getLinkStyle(false), color: '#ef4444', marginTop: '4px' }}
          onClick={onLogout}
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
