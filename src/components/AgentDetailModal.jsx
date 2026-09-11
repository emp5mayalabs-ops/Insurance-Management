import { 
  X, Mail, Phone, Hash, User, 
  CheckCircle, XCircle, Edit3, Shield
} from 'lucide-react';

export default function AgentDetailModal({ agent, isOpen, onClose, onEdit, onToggleStatus }) {
  if (!isOpen || !agent) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Banner */}
        <div className="detail-banner">
          <div className="detail-banner-content">
            <div className="detail-avatar" style={{ backgroundColor: '#2563eb' }}>
              {(agent.username || agent.agent_id || 'A').slice(0, 2).toUpperCase()}
            </div>
            <div className="detail-header-info">
              <div className="detail-name-row">
                <h2>{agent.username || 'Agent Profile'}</h2>
                <span className={`status-badge ${agent.is_active ? 'active' : 'inactive'}`}>
                  {agent.is_active ? (
                    <>
                      <span className="pulse-dot"></span> Active
                    </>
                  ) : (
                    <>
                      <span className="inactive-dot"></span> Inactive
                    </>
                  )}
                </span>
              </div>
              <div className="detail-meta">
                <span className="code-pill font-mono">{agent.agent_id || `ID #${agent.id}`}</span>
                <span className="meta-separator">•</span>
                <span>System ID: #{agent.id}</span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-scroll-body">
          {/* Main Details Section */}
          <div className="detail-sections">
            <div className="info-block">
              <h4 className="info-block-title">
                <Shield size={16} /> Agent Account Information
              </h4>
              <div className="info-pairs-grid">
                <div className="info-pair">
                  <span className="info-label">
                    <Hash size={13} className="inline-icon" /> Agent ID
                  </span>
                  <span className="info-value font-mono font-bold text-blue-700">
                    {agent.agent_id || 'N/A'}
                  </span>
                </div>

                <div className="info-pair">
                  <span className="info-label">
                    <User size={13} className="inline-icon" /> Username
                  </span>
                  <span className="info-value font-semibold">
                    {agent.username || 'N/A'}
                  </span>
                </div>

                <div className="info-pair">
                  <span className="info-label">
                    <Mail size={13} className="inline-icon" /> Email Address
                  </span>
                  <a href={`mailto:${agent.email}`} className="info-link">
                    {agent.email || 'N/A'}
                  </a>
                </div>

                <div className="info-pair">
                  <span className="info-label">
                    <Phone size={13} className="inline-icon" /> Phone Number
                  </span>
                  <a href={`tel:${agent.phone}`} className="info-link">
                    {agent.phone || 'N/A'}
                  </a>
                </div>

                <div className="info-pair">
                  <span className="info-label">Account Status</span>
                  <span className="info-value flex items-center gap-1">
                    {agent.is_active ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={15} /> Active Agent
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <XCircle size={15} /> Inactive Agent
                      </span>
                    )}
                  </span>
                </div>

                <div className="info-pair">
                  <span className="info-label">Database Record ID</span>
                  <span className="info-value font-mono text-slate-500">
                    {agent.id || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional extra backend fields if present */}
            {(agent.date_joined || agent.created_at || agent.branch) && (
              <div className="info-block">
                <h4 className="info-block-title">Additional Information</h4>
                <div className="info-pairs-grid">
                  {agent.branch && (
                    <div className="info-pair">
                      <span className="info-label">Branch</span>
                      <span className="info-value">{agent.branch}</span>
                    </div>
                  )}
                  {(agent.date_joined || agent.created_at) && (
                    <div className="info-pair">
                      <span className="info-label">Date Registered</span>
                      <span className="info-value">
                        {new Date(agent.date_joined || agent.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer detail-modal-footer">
          <div className="footer-status-toggle">
            <span className="toggle-label">Status:</span>
            <button
              type="button"
              className={`status-toggle-pill ${agent.is_active ? 'btn-active' : 'btn-inactive'}`}
              onClick={() => onToggleStatus(agent)}
            >
              {agent.is_active ? (
                <>
                  <CheckCircle size={15} /> Active (Click to Deactivate)
                </>
              ) : (
                <>
                  <XCircle size={15} /> Inactive (Click to Activate)
                </>
              )}
            </button>
          </div>

          <div className="footer-action-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(agent);
              }}
            >
              <Edit3 size={15} /> Edit Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
