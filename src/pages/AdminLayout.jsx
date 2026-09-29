import { useState, useEffect, useCallback } from 'react';
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
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'agents';
  const handleNavigate = (tab) => navigate(`/admin/${tab}`);

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [agentCounts, setAgentCounts] = useState({ total: 0, active: 0 });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login/admin', { replace: true });
  }, [isAuthenticated, navigate]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(prev => prev.message === message ? { message: '', type: 'success' } : prev), 4500);
  }, []);

  const refreshCounts = async () => {
    try {
      const res = await getAgents();
      const list = res.data || [];
      setAgentCounts({ total: list.length, active: list.filter(a => a.is_active).length });
    } catch {}
  };

  useEffect(() => { if (isAuthenticated) refreshCounts(); }, [isAuthenticated, currentTab]);

  const handleQuickCreateSave = async (formData) => {
    await createAgent(formData);
    showToast(`Agent ${formData.username} created successfully!`, 'success');
    refreshCounts();
  };

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); navigate('/login/admin', { replace: true }); };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        agentCount={agentCounts.total}
        activeCount={agentCounts.active}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar onNavigate={handleNavigate} currentTab={currentTab} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#f8fafc' }}>
          <Routes>
            <Route path="dashboard" element={<DashboardPage onNavigate={handleNavigate} onOpenCreateModal={() => setIsQuickCreateOpen(true)} />} />
            <Route path="agents" element={<AgentsPage onShowToast={showToast} />} />
            <Route path="policies" element={
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Policies In-Force Overview</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>529 Active Policies bound across 6 regional branches</p>
              </div>
            } />
            <Route path="claims" element={
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Claims Settlement Center</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>18 pending claims currently under underwriting assessment</p>
              </div>
            } />
            <Route path="reports" element={
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Underwriting & Actuarial Reports</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Gross Written Premium & Agent Production Analytics</p>
              </div>
            } />
            <Route index element={<Navigate to="agents" replace />} />
          </Routes>
        </main>
      </div>

      <AgentModal isOpen={isQuickCreateOpen} onClose={() => setIsQuickCreateOpen(false)} onSave={handleQuickCreateSave} isEditing={false} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
