import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, RefreshCw, Eye, Edit3, Trash2, AlertCircle, Mail, Phone, Users } from 'lucide-react';
import { getAgents, createAgent, updateAgent, deleteAgent, getAgentById } from '../services/api';
import AgentModal from '../components/AgentModal';
import AgentDetailModal from '../components/AgentDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';

const AVATAR_COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981'];

export default function AgentsPage({ onShowToast }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingIds, setTogglingIds] = useState(new Set());

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAgents();
      setAgents(res.data || []);
    } catch (err) {
      onShowToast(err.message || 'Failed to fetch agents', 'error');
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      (agent.agent_id && String(agent.agent_id).toLowerCase().includes(query)) ||
      (agent.username && String(agent.username).toLowerCase().includes(query)) ||
      (agent.email && String(agent.email).toLowerCase().includes(query)) ||
      (agent.phone && String(agent.phone).toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'ALL' ? true : statusFilter === 'ACTIVE' ? agent.is_active : !agent.is_active;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = async (agent) => {
    try { const res = await getAgentById(agent.id); setSelectedAgent(res.agentData || res.data || agent); }
    catch { setSelectedAgent(agent); }
    setIsDetailOpen(true);
  };

  const handleEdit = (agent, e) => { if (e) e.stopPropagation(); setSelectedAgent(agent); setIsEditOpen(true); };

  const handleToggleStatus = async (agent, e) => {
    if (e) e.stopPropagation();
    const nextStatus = !agent.is_active;
    setTogglingIds(prev => new Set(prev).add(agent.id));
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_active: nextStatus } : a));
    try {
      await updateAgent(agent.id, { is_active: nextStatus });
      onShowToast(`Agent ${agent.agent_id || agent.username} is now ${nextStatus ? 'Active' : 'Inactive'}.`, 'success');
      if (selectedAgent && selectedAgent.id === agent.id) setSelectedAgent(prev => ({ ...prev, is_active: nextStatus }));
    } catch (err) {
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, is_active: !nextStatus } : a));
      onShowToast(err.message || 'Could not update agent status', 'error');
    } finally {
      setTogglingIds(prev => { const next = new Set(prev); next.delete(agent.id); return next; });
    }
  };

  const handleCreateAgent = async (formData) => {
    await createAgent(formData);
    onShowToast(`Agent ${formData.agent_id || formData.username} created!`, 'success');
    fetchAgents();
  };

  const handleUpdateAgent = async (formData) => {
    if (!selectedAgent) return;
    await updateAgent(selectedAgent.id, formData);
    onShowToast(`Agent ${formData.agent_id || formData.username} updated!`, 'success');
    fetchAgents();
  };

  const promptDelete = (agent, e) => { if (e) e.stopPropagation(); setDeleteTarget(agent); };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAgent(deleteTarget.id);
      onShowToast(`Agent ${deleteTarget.agent_id || deleteTarget.username} deleted.`, 'info');
      setDeleteTarget(null);
      fetchAgents();
    } catch (err) {
      onShowToast(err.message || 'Failed to delete agent', 'error');
    } finally { setIsDeleting(false); }
  };

  const activeCount = agents.filter(a => a.is_active).length;
  const inactiveCount = agents.length - activeCount;

  const card = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' };
  const th = { padding: '12px 16px', fontWeight: 600, color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0', textAlign: 'left', whiteSpace: 'nowrap' };
  const td = { padding: '14px 16px', fontSize: '13px', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' };
  const filterPillBase = { padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.15s' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            <span>Admin Portal</span><span style={{ color: '#94a3b8' }}>&gt;</span>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>Insurance Agents</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Insurance Agents</h1>
            <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>{agents.length} Total</span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Admin agent roster with instant activate/deactivate controls</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }} onClick={fetchAgents}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }} onClick={() => setIsCreateOpen(true)}>
            <UserPlus size={15} /> Create Agent
          </button>
        </div>
      </div>

      {/* Search + Filter toolbar */}
      <div style={{ ...card, marginBottom: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', overflow: 'visible' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px' }}>
          <Search size={15} color="#94a3b8" />
          <input type="text" placeholder="Search by Agent ID, Username, Email, or Phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#374151' }} />
          {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '16px', lineHeight: 1 }}>✕</button>}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['ALL', `All (${agents.length})`], ['ACTIVE', `Active (${activeCount})`], ['INACTIVE', `Inactive (${inactiveCount})`]].map(([key, label]) => (
            <button key={key} style={{ ...filterPillBase, backgroundColor: statusFilter === key ? '#3b82f6' : '#f1f5f9', color: statusFilter === key ? '#fff' : '#64748b' }} onClick={() => setStatusFilter(key)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th style={{ ...th, width: '130px' }}>Agent ID</th>
                <th style={th}>Username</th>
                <th style={th}>Email Address</th>
                <th style={th}>Phone Number</th>
                <th style={{ ...th, width: '160px' }}>Status</th>
                <th style={{ ...th, width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && agents.length === 0 ? (
                <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                  <div style={{ marginTop: '8px' }}>Loading agent records...</div>
                </td></tr>
              ) : filteredAgents.length === 0 ? (
                <tr><td colSpan="6" style={{ ...td, textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  <AlertCircle size={32} style={{ marginBottom: '8px' }} />
                  <div style={{ fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>No matching agents found</div>
                  <div style={{ fontSize: '12px' }}>Try modifying your search or onboard a new agent.</div>
                </td></tr>
              ) : (
                filteredAgents.map((agent, idx) => {
                  const isToggling = togglingIds.has(agent.id);
                  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const initials = (agent.username || agent.agent_id || 'A').slice(0, 2).toUpperCase();
                  return (
                    <tr key={agent.id} style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                      onClick={() => handleViewDetail(agent)}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                    >
                      <td style={td}>
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', padding: '3px 8px', borderRadius: '6px' }}>
                          {agent.agent_id || `ID-${agent.id}`}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{agent.username || 'N/A'}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Record #{agent.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={13} color="#94a3b8" />
                          <a href={`mailto:${agent.email}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '13px' }} onClick={e => e.stopPropagation()}>{agent.email || 'N/A'}</a>
                        </div>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace' }}>
                          <Phone size={13} color="#94a3b8" />
                          <span style={{ color: '#374151' }}>{agent.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={td} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label className="switch" title={agent.is_active ? 'Click to deactivate' : 'Click to activate'}>
                            <input type="checkbox" checked={!!agent.is_active} disabled={isToggling} onChange={e => handleToggleStatus(agent, e)} />
                            <span className="slider round"></span>
                          </label>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: isToggling ? '#94a3b8' : agent.is_active ? '#16a34a' : '#dc2626' }}>
                            {isToggling ? 'Updating...' : agent.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...td, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '5px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }} onClick={() => handleViewDetail(agent)} title="View"><Eye size={15} /></button>
                          <button style={{ backgroundColor: '#fffbeb', color: '#d97706', border: 'none', padding: '5px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }} onClick={e => handleEdit(agent, e)} title="Edit"><Edit3 size={15} /></button>
                          <button style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', padding: '5px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }} onClick={e => promptDelete(agent, e)} title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
          <span>Showing {filteredAgents.length} of {agents.length} agents</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />Active ({activeCount})</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />Inactive ({inactiveCount})</span>
          </div>
        </div>
      </div>

      <AgentModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleCreateAgent} isEditing={false} />
      <AgentModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={handleUpdateAgent} agent={selectedAgent} isEditing={true} />
      <AgentDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} agent={selectedAgent} onEdit={agent => { setSelectedAgent(agent); setIsEditOpen(true); }} onToggleStatus={agent => handleToggleStatus(agent)} />
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Agent Record" message={deleteTarget ? `Delete agent "${deleteTarget.username}" (${deleteTarget.agent_id || `#${deleteTarget.id}`})? This cannot be undone.` : ''} confirmText="Confirm Delete" isDanger={true} loading={isDeleting} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
