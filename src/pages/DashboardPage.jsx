import { useState, useEffect } from 'react';
import { Users, ShieldCheck, DollarSign, Award, ArrowUpRight, TrendingUp, UserPlus, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { getAgents } from '../services/api';

export default function DashboardPage({ onNavigate, onOpenCreateModal }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    getAgents().then(res => setAgents(res.data || []));
  }, []);

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.is_active).length;
  const inactiveAgents = totalAgents - activeAgents;
  const totalPolicies = agents.reduce((acc, a) => acc + (a.policies_count || 0), 0);
  const topAgents = [...agents].sort((a, b) => (b.policies_count || 0) - (a.policies_count || 0)).slice(0, 4);

  const kpiCards = [
    { label: 'Agent Network', value: totalAgents, trend: `${activeAgents} Active`, trendColor: '#16a34a', trendBg: '#dcfce7', icon: <Users size={20} />, iconBg: '#eff6ff', iconColor: '#3b82f6', sub: `${inactiveAgents} agents pending renewal` },
    { label: 'Policies In-Force', value: totalPolicies, trend: 'In-Force', trendColor: '#16a34a', trendBg: '#dcfce7', icon: <ShieldCheck size={20} />, iconBg: '#f0fdf4', iconColor: '#16a34a', sub: 'Aggregated across all agents' },
    { label: 'Gross Written Premium', value: '$2.1M', trend: '+12.3% YTD', trendColor: '#d97706', trendBg: '#fef3c7', icon: <DollarSign size={20} />, iconBg: '#fffbeb', iconColor: '#d97706', sub: '98.6% claim settlement score' },
    { label: 'Avg Commission Rate', value: '13.8%', trend: 'Tier 1 Target', trendColor: '#7c3aed', trendBg: '#ede9fe', icon: <Award size={20} />, iconBg: '#f5f3ff', iconColor: '#7c3aed', sub: 'Performance-linked incentives' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
            <span>Admin Portal</span>
            <span style={{ color: '#94a3b8' }}>&gt;</span>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>Dashboard</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Fleet underwriting performance, agent capacity, and policy binding metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }} onClick={() => onNavigate('agents')}>
            <Users size={15} /> View Agents
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }} onClick={onOpenCreateModal}>
            <UserPlus size={15} /> Onboard New Agent
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {kpiCards.map(card => (
          <div key={card.label} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{card.label}</span>
              <div style={{ backgroundColor: card.iconBg, color: card.iconColor, padding: '8px', borderRadius: '8px', display: 'flex' }}>{card.icon}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: card.trendColor, backgroundColor: card.trendBg, padding: '2px 8px', borderRadius: '20px' }}>{card.trend}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Top Agents */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Top Producing Insurance Agents</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Ranked by volume of active policies</div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3b82f6', fontWeight: 600 }} onClick={() => onNavigate('agents')}>See all <ChevronRight size={14} /></button>
          </div>
          {topAgents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>No agents yet. Click "Onboard New Agent" to get started.</div>
          ) : (
            topAgents.map((agent, idx) => (
              <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: idx < topAgents.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', width: '20px' }}>#{idx + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: agent.avatar_color || '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                  {(agent.username || 'A').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{agent.username}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{agent.agent_id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{agent.policies_count || 0} Policies</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: agent.is_active ? '#dcfce7' : '#fee2e2', color: agent.is_active ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: '10px' }}>
                  {agent.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Activity Feed */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Recent Agency Operations</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Real-time audit events</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: '20px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
              Live
            </div>
          </div>
          {[
            { color: '#3b82f6', bg: '#eff6ff', icon: <ShieldCheck size={13} />, title: 'Commercial Umbrella Policy Bound', desc: 'Agent Michael Torres issued $1.2M policy.', time: '14 min ago' },
            { color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle size={13} />, title: 'License Verification Passed', desc: 'Sarah Jenkins submitted CE proof.', time: '1 hour ago' },
            { color: '#7c3aed', bg: '#ede9fe', icon: <UserPlus size={13} />, title: 'New Territory Assignment', desc: 'Amina Patel onboarded South East.', time: '3 hours ago' },
            { color: '#d97706', bg: '#fef3c7', icon: <Clock size={13} />, title: 'Agent Status Updated', desc: 'Elena Rostova on temporary leave.', time: 'Yesterday' },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: i < arr.length - 1 ? '14px' : 0, marginBottom: i < arr.length - 1 ? '14px' : 0, borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#0f172a', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>{item.desc}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
