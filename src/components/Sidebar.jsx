import { 
  LayoutDashboard, Users, ShieldAlert, FileCheck, 
  BarChart3, ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ currentTab, onNavigate, agentCount = 0, activeCount = 0 }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
      badge: null
    },
    {
      id: 'agents',
      label: 'Insurance Agents',
      icon: <Users size={19} />,
      badge: `${activeCount}/${agentCount}`
    },
    {
      id: 'policies',
      label: 'Policies In-Force',
      icon: <ShieldCheck size={19} />,
      badge: '529'
    },
    {
      id: 'claims',
      label: 'Claims Settlement',
      icon: <ShieldAlert size={19} />,
      badge: '18 Pending'
    },
    {
      id: 'reports',
      label: 'Underwriting Reports',
      icon: <BarChart3 size={19} />,
      badge: null
    }
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-section-title">MAIN NAVIGATION</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="sidebar-link-content">
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`sidebar-badge ${isActive ? 'badge-active' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Insurance Compliance Banner in Sidebar */}
      <div className="sidebar-compliance-card">
        <div className="compliance-icon-wrap">
          <FileCheck size={18} />
        </div>
        <div className="compliance-text">
          <div className="compliance-title">Compliance Audit</div>
          <div className="compliance-desc">All agents certified under state insurance regulatory standards.</div>
        </div>
      </div>
    </aside>
  );
}
