import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from './DashboardPage';
import AgentsPage from './AgentsPage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import Toast from '../components/Toast';
import { getAgents, createAgent } from '../services/api';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split('/')[2] || 'agents';

  const handleNavigate = (tab) => {
    navigate(`/admin/${tab}`);
  };
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [agentCounts, setAgentCounts] = useState({ total: 0, active: 0 });

  // Redirect to admin login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev.message === message ? { message: '', type: 'success' } : prev));
    }, 4500);
  };

  const refreshCounts = async () => {
    try {
      const res = await getAgents();
      const list = res.data || [];
      const active = list.filter((a) => a.is_active).length;
      setAgentCounts({ total: list.length, active });
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCounts();
    }
  }, [isAuthenticated, currentTab]);

  const handleQuickCreateSave = async (formData) => {
    await createAgent(formData);
    showToast(`Agent ${formData.username} created successfully!`, 'success');
    refreshCounts();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="app-layout">
      <Navbar onNavigate={handleNavigate} currentTab={currentTab} />
      <div className="app-main-layout">
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          agentCount={agentCounts.total}
          activeCount={agentCounts.active}
        />
        <main className="app-content-area">
          <Routes>
            <Route path="dashboard" element={<DashboardPage onNavigate={handleNavigate} onOpenCreateModal={() => setIsQuickCreateOpen(true)} />} />
            <Route path="agents" element={<AgentsPage onShowToast={showToast} />} />
            <Route path="policies" element={
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h2 className="dash-card-title">Policies In-Force Overview</h2>
                    <p className="dash-card-subtitle">529 Active Policies bound across 6 regional branches</p>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => handleNavigate('agents')}>
                    Manage Policy Producers
                  </button>
                </div>
                <p className="text-slate-600 text-sm mt-3">
                  Select the <strong>Insurance Agents</strong> tab from the sidebar to inspect licensed agents authorized to issue and renew policies.
                </p>
              </div>
            } />
            <Route path="claims" element={
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h2 className="dash-card-title">Claims Settlement Center</h2>
                    <p className="dash-card-subtitle">18 pending claims currently under underwriting assessment</p>
                  </div>
                  <button type="button" className="btn btn-secondary" onClick={() => handleNavigate('dashboard')}>
                    Back to Dashboard
                  </button>
                </div>
                <p className="text-slate-600 text-sm mt-3">
                  Agent commission disbursements are synchronized upon successful claim loss-ratio validation.
                </p>
              </div>
            } />
            <Route path="reports" element={
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h2 className="dash-card-title">Underwriting &amp; Actuarial Reports</h2>
                    <p className="dash-card-subtitle">Gross Written Premium &amp; Agent Production Analytics</p>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => handleNavigate('agents')}>
                    Export Agent Roster
                  </button>
                </div>
                <p className="text-slate-600 text-sm mt-3">
                  Quarterly regulatory filings conform to state Department of Insurance (DOI) auditing guidelines.
                </p>
              </div>
            } />
            <Route index element={<Navigate to="agents" replace />} />
          </Routes>
        </main>
      </div>

      <AgentModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onSave={handleQuickCreateSave}
        isEditing={false}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
