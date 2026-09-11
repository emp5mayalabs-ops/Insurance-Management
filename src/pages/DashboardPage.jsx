import { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, DollarSign, Award, ArrowUpRight, 
  TrendingUp, UserPlus, CheckCircle, Clock, ChevronRight 
} from 'lucide-react';
import { getAgents } from '../services/api';

export default function DashboardPage({ onNavigate, onOpenCreateModal }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    getAgents().then((res) => {
      setAgents(res.data || []);
    });
  }, []);

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.is_active).length;
  const inactiveAgents = totalAgents - activeAgents;
  const totalPolicies = agents.reduce((acc, a) => acc + (a.policies_count || 0), 0);

  // Top agents sorted by policies count
  const topAgents = [...agents]
    .sort((a, b) => (b.policies_count || 0) - (a.policies_count || 0))
    .slice(0, 4);

  return (
    <div className="dashboard-content">
      {/* Page Title & Quick Actions */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Insurance Executive Overview</h1>
          <p className="page-subtitle">
            Fleet underwriting performance, agent capacity, and policy binding metrics
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('agents')}
          >
            <Users size={16} /> View Agents Directory
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <UserPlus size={16} /> Onboard New Agent
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Card 1: Agents */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Agent Network</span>
            <div className="kpi-icon-wrap blue">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalAgents}</span>
            <span className="kpi-trend positive">
              <ArrowUpRight size={14} /> {activeAgents} Active
            </span>
          </div>
          <div className="kpi-footer-text">
            <span>{inactiveAgents} agents pending renewal or on leave</span>
          </div>
        </div>

        {/* Card 2: Active Policies */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Policies In-Force</span>
            <div className="kpi-icon-wrap emerald">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{totalPolicies}</span>
            <span className="kpi-trend positive">
              <TrendingUp size={14} /> In-Force
            </span>
          </div>
          <div className="kpi-footer-text">
            <span>Aggregated across all licensed agent portfolios</span>
          </div>
        </div>

        {/* Card 3: Total Premium Written */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Gross Written Premium</span>
            <div className="kpi-icon-wrap amber">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">$2.1M</span>
            <span className="kpi-trend positive">
              <ArrowUpRight size={14} /> +12.3% YTD
            </span>
          </div>
          <div className="kpi-footer-text">
            <span>98.6% claim settlement liquidity score</span>
          </div>
        </div>

        {/* Card 4: Underwriting Commission */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg Commission Rate</span>
            <div className="kpi-icon-wrap purple">
              <Award size={20} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">13.8%</span>
            <span className="kpi-trend neutral">Tier 1 Target</span>
          </div>
          <div className="kpi-footer-text">
            <span>Performance-linked broker tier incentives</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Leaders & Recent Activity */}
      <div className="dashboard-sections-grid">
        {/* Top Producing Agents */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Top Producing Insurance Agents</h3>
              <p className="dash-card-subtitle">Ranked by volume of active policies in good standing</p>
            </div>
            <button
              type="button"
              className="link-button"
              onClick={() => onNavigate('agents')}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>

          <div className="leaderboard-list">
            {topAgents.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                No agent records in backend yet. Click "Onboard New Agent" to register an agent.
              </div>
            ) : (
              topAgents.map((agent, idx) => (
                <div key={agent.id} className="leaderboard-item">
                  <div className="leader-rank">#{idx + 1}</div>
                  <div
                    className="leader-avatar"
                    style={{ backgroundColor: agent.avatar_color || '#3b82f6' }}
                  >
                    {agent.first_name?.[0]}{agent.last_name?.[0]}
                  </div>
                  <div className="leader-info">
                    <div className="leader-name">
                      {agent.first_name} {agent.last_name}
                    </div>
                    <div className="leader-meta">
                      <span>{agent.specialization}</span> • <span>{agent.branch}</span>
                    </div>
                  </div>
                  <div className="leader-stats">
                    <div className="leader-policies">{agent.policies_count || 0} Policies</div>
                    <div className="leader-premium">{agent.total_premium || '$0'}</div>
                  </div>
                  <span className={`status-badge-compact ${agent.is_active ? 'active' : 'inactive'}`}>
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agency Activity Feed */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Recent Agency Operations</h3>
              <p className="dash-card-subtitle">Real-time underwriting and agent audit events</p>
            </div>
            <div className="activity-live-badge">
              <span className="pulse-dot"></span> Live
            </div>
          </div>

          <div className="activity-timeline">
            <div className="timeline-item">
              <div className="timeline-marker blue">
                <ShieldCheck size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-title">Commercial Umbrella Policy Bound</div>
                <div className="timeline-desc">Agent Michael Torres issued $1.2M policy #POL-89021.</div>
                <div className="timeline-time">14 minutes ago</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker emerald">
                <CheckCircle size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-title">License Verification Passed</div>
                <div className="timeline-desc">Sarah Jenkins submitted annual state continuing education proof.</div>
                <div className="timeline-time">1 hour ago</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker purple">
                <UserPlus size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-title">New Territory Assignment</div>
                <div className="timeline-desc">Amina Patel onboarded for South East Regional branch.</div>
                <div className="timeline-time">3 hours ago</div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker amber">
                <Clock size={14} />
              </div>
              <div className="timeline-content">
                <div className="timeline-title">Agent Status Updated</div>
                <div className="timeline-desc">Elena Rostova transitioned to temporary leave status.</div>
                <div className="timeline-time">Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
