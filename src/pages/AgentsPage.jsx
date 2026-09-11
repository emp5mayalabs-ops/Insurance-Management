import { useState, useEffect, useCallback } from 'react';
import { 
  UserPlus, Search, RefreshCw, Eye, 
  Edit3, Trash2, AlertCircle, Mail, Phone
} from 'lucide-react';
import { 
  getAgents, createAgent, updateAgent, deleteAgent, getAgentById 
} from '../services/api';
import AgentModal from '../components/AgentModal';
import AgentDetailModal from '../components/AgentDetailModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function AgentsPage({ onShowToast }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Confirm Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggling status per agent tracking
  const [togglingIds, setTogglingIds] = useState(new Set());

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAgents();
      setAgents(res.data || []);
    } catch (err) {
      onShowToast(err.message || 'Failed to fetch insurance agents', 'error');
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Filter logic matching the exact fields: agent_id, username, email, phone
  const filteredAgents = agents.filter((agent) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      (agent.agent_id && String(agent.agent_id).toLowerCase().includes(query)) ||
      (agent.username && String(agent.username).toLowerCase().includes(query)) ||
      (agent.email && String(agent.email).toLowerCase().includes(query)) ||
      (agent.phone && String(agent.phone).toLowerCase().includes(query));

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'ACTIVE' ? agent.is_active :
      !agent.is_active;

    return matchesSearch && matchesStatus;
  });

  // Action: Open Specific Agent Detail View
  // Calls Endpoint 5: GET /api/admin/agents/<id>/
  const handleViewDetail = async (agent) => {
    try {
      const res = await getAgentById(agent.id);
      setSelectedAgent(res.data);
      setIsDetailOpen(true);
    } catch {
      setSelectedAgent(agent);
      setIsDetailOpen(true);
    }
  };

  // Action: Open Edit Modal
  const handleEdit = (agent, e) => {
    if (e) e.stopPropagation();
    setSelectedAgent(agent);
    setIsEditOpen(true);
  };

  // Action: Activate/Deactivate Toggle Slider in Row
  // Calls Endpoint 7: PUT /api/admin/agents/<id>/update/ with { "is_active": true/false }
  const handleToggleStatus = async (agent, e) => {
    if (e) e.stopPropagation();
    const nextStatus = !agent.is_active;
    
    // Mark as in-flight
    setTogglingIds((prev) => new Set(prev).add(agent.id));
    
    // Optimistic local state update
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, is_active: nextStatus } : a))
    );

    try {
      await updateAgent(agent.id, { is_active: nextStatus });
      onShowToast(
        `Agent ${agent.agent_id || agent.username} is now ${nextStatus ? 'Active' : 'Inactive'}.`,
        'success'
      );
      if (selectedAgent && selectedAgent.id === agent.id) {
        setSelectedAgent((prev) => ({ ...prev, is_active: nextStatus }));
      }
    } catch (err) {
      // Revert optimistic update
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, is_active: !nextStatus } : a))
      );
      onShowToast(err.message || 'Could not update agent status', 'error');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(agent.id);
        return next;
      });
    }
  };

  // Action: Create Agent
  // Calls Endpoint 3: POST /api/admin/agents/create/ with { username, password, email, agent_id, phone }
  const handleCreateAgent = async (formData) => {
    await createAgent(formData);
    onShowToast(
      `Agent ${formData.agent_id || formData.username} created successfully!`,
      'success'
    );
    fetchAgents();
  };

  // Action: Update Agent
  // Calls Endpoint 6: PUT /api/admin/agents/<id>/update/
  const handleUpdateAgent = async (formData) => {
    if (!selectedAgent) return;
    await updateAgent(selectedAgent.id, formData);
    onShowToast(
      `Agent ${formData.agent_id || formData.username} updated successfully!`,
      'success'
    );
    fetchAgents();
  };

  // Action: Delete Agent Confirmation
  const promptDelete = (agent, e) => {
    if (e) e.stopPropagation();
    setDeleteTarget(agent);
  };

  // Calls Endpoint 8: DELETE /api/admin/agents/<id>/delete/
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAgent(deleteTarget.id);
      onShowToast(
        `Agent ${deleteTarget.agent_id || deleteTarget.username} deleted successfully.`,
        'info'
      );
      setDeleteTarget(null);
      fetchAgents();
    } catch (err) {
      onShowToast(err.message || 'Failed to delete agent', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = agents.filter((a) => a.is_active).length;
  const inactiveCount = agents.length - activeCount;

  return (
    <div className="agents-page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">Insurance Agents Directory</h1>
            <span className="count-pill">{agents.length} Total</span>
          </div>
          <p className="page-subtitle">
            Admin agent roster with instant activate/deactivate slider controls and profile management
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchAgents}
            title="Refresh agents list"
          >
            <RefreshCw size={15} className={loading ? 'spin-animation' : ''} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            <UserPlus size={16} /> Create Agent
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="table-controls-card">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Agent ID, Username, Email, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-group">
          {/* Status Tabs */}
          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All ({agents.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              className={`filter-pill ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              Inactive ({inactiveCount})
            </button>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="agents-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Agent ID</th>
                <th>Username</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th className="th-status" style={{ width: '180px' }}>Status (Slider)</th>
                <th className="th-actions text-right" style={{ width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && agents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    <div className="loading-state">
                      <RefreshCw size={24} className="spin-animation text-blue-600" />
                      <span>Loading insurance agent records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    <div className="empty-state">
                      <AlertCircle size={36} className="text-slate-400" />
                      <h4>No matching insurance agents found</h4>
                      <p>Try modifying your search query or onboard a new agent.</p>
                      <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={() => setIsCreateOpen(true)}
                      >
                        <UserPlus size={16} /> Create Agent
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => {
                  const isToggling = togglingIds.has(agent.id);
                  const initialLetters = (agent.username || agent.agent_id || 'A').slice(0, 2).toUpperCase();

                  return (
                    <tr 
                      key={agent.id} 
                      className="agent-row"
                      onClick={() => handleViewDetail(agent)}
                      title="Click row to view agent details"
                    >
                      {/* Column 1: Agent ID */}
                      <td>
                        <span className="code-pill font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200">
                          {agent.agent_id || `ID-${agent.id}`}
                        </span>
                      </td>

                      {/* Column 2: Username & Avatar */}
                      <td>
                        <div className="agent-profile-cell">
                          <div
                            className="agent-avatar"
                            style={{ backgroundColor: '#2563eb' }}
                          >
                            {initialLetters}
                          </div>
                          <div>
                            <div className="agent-full-name font-semibold text-slate-900">
                              {agent.username || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-400">
                              Record #{agent.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Email */}
                      <td>
                        <div className="cell-primary flex items-center gap-1.5 text-slate-700">
                          <Mail size={13} className="text-slate-400" />
                          <a 
                            href={`mailto:${agent.email}`} 
                            className="hover:underline text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {agent.email || 'N/A'}
                          </a>
                        </div>
                      </td>

                      {/* Column 4: Phone */}
                      <td>
                        <div className="cell-primary flex items-center gap-1.5 text-slate-700 font-mono">
                          <Phone size={13} className="text-slate-400" />
                          <span>{agent.phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Column 5: Status with Activate/Deactivate Slider Switch */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="status-slider-container">
                          <label className="switch" title={agent.is_active ? 'Click to deactivate' : 'Click to activate'}>
                            <input
                              type="checkbox"
                              checked={!!agent.is_active}
                              disabled={isToggling}
                              onChange={(e) => handleToggleStatus(agent, e)}
                            />
                            <span className="slider round"></span>
                          </label>
                          <span className={`status-label ${agent.is_active ? 'text-active' : 'text-inactive'}`}>
                            {isToggling ? 'Updating...' : agent.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Column 6: Row Actions (View Details, Edit, Delete) */}
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions-group">
                          {/* 1. View Details */}
                          <button
                            type="button"
                            className="action-icon-btn btn-view"
                            onClick={() => handleViewDetail(agent)}
                            title="View Agent Details"
                          >
                            <Eye size={16} />
                          </button>

                          {/* 2. Edit Agent */}
                          <button
                            type="button"
                            className="action-icon-btn btn-edit"
                            onClick={(e) => handleEdit(agent, e)}
                            title="Edit Agent Credentials"
                          >
                            <Edit3 size={16} />
                          </button>

                          {/* 3. Delete Agent */}
                          <button
                            type="button"
                            className="action-icon-btn btn-delete"
                            onClick={(e) => promptDelete(agent, e)}
                            title="Delete Agent Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="table-footer">
          <span className="text-xs text-slate-500">
            Showing {filteredAgents.length} of {agents.length} insurance agents
          </span>
          <div className="table-status-legend">
            <span className="legend-item">
              <span className="legend-dot active"></span> Active ({activeCount})
            </span>
            <span className="legend-item">
              <span className="legend-dot inactive"></span> Inactive ({inactiveCount})
            </span>
          </div>
        </div>
      </div>

      {/* Modal 1: Create New Agent Window */}
      <AgentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateAgent}
        isEditing={false}
      />

      {/* Modal 2: Edit Agent Window */}
      <AgentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdateAgent}
        agent={selectedAgent}
        isEditing={true}
      />

      {/* Modal 3: View Agent Details Window on selection */}
      <AgentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        agent={selectedAgent}
        onEdit={(agent) => {
          setSelectedAgent(agent);
          setIsEditOpen(true);
        }}
        onToggleStatus={(agent) => handleToggleStatus(agent)}
      />

      {/* Modal 4: Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Agent Record"
        message={
          deleteTarget
            ? `Are you sure you want to delete agent "${deleteTarget.username}" (${deleteTarget.agent_id || `#${deleteTarget.id}`})? This calls DELETE /api/admin/agents/${deleteTarget.id}/delete/ and cannot be undone.`
            : ''
        }
        confirmText="Confirm Delete"
        isDanger={true}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
