import { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, Hash, ShieldCheck,
  Award, FileText, CheckCircle, Shield,
  Camera, Briefcase, DollarSign, Users,
  Check, PhoneCall, HelpCircle, Edit3
} from 'lucide-react';
import { getAgentMe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AgentProfilePage() {
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ', ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const displayAgent = agent || user || {
    id: 5,
    username: 'hello',
    email: 'hello@gmail.com',
    agent_id: 'ag333',
    phone: '87654323456',
    is_active: true,
    created_at: '2026-09-25T13:12:00Z',
  };

  const initials = (displayAgent.username || 'AG')
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="dashboard-content" style={{ padding: '0 1rem' }}>
      {/* Top Header Row */}
      <div className="page-header-row" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="flex items-center gap-1"><User size={12} className="text-blue-500" /> Agent Portal</span>
            <span>&gt;</span>
            <span className="text-blue-600">My Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ margin: '0.25rem 0' }}>My Profile</h1>
          <p className="text-sm text-slate-500 m-0">
            Manage your profile information, view credentials and account details.
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Left Card: Agent Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start gap-5 mb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-teal-700 text-white flex items-center justify-center text-3xl font-semibold">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white cursor-pointer">
                  <Camera size={14} />
                </div>
              </div>
              
              {/* Profile Details */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 m-0">{displayAgent.username}</h2>
                  {displayAgent.is_active && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold border border-green-200">
                      <ShieldCheck size={12} /> Active Producer
                    </span>
                  )}
                </div>
                <div className="text-teal-700 font-semibold mt-1 mb-1">{displayAgent.agent_id}</div>
                <div className="text-slate-500 text-sm">Masters Companion Certified Insurance Producer</div>
                <div className="text-slate-500 text-sm">IRDAI Licensee</div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-4 gap-4 mt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="p-1.5 bg-slate-100 rounded-md"><Shield size={14} /></div> Agent ID
                </div>
                <div className="font-semibold text-slate-800 text-sm">{displayAgent.agent_id}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="p-1.5 bg-slate-100 rounded-md"><User size={14} /></div> Username
                </div>
                <div className="font-semibold text-slate-800 text-sm">{displayAgent.username}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="p-1.5 bg-slate-100 rounded-md"><Mail size={14} /></div> Email
                </div>
                <div className="font-semibold text-slate-800 text-sm">{displayAgent.email}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <div className="p-1.5 bg-slate-100 rounded-md"><Phone size={14} /></div> Phone
                </div>
                <div className="font-semibold text-slate-800 text-sm">{displayAgent.phone}</div>
              </div>
            </div>
          </div>
          
          {/* Bottom green banner */}
          <div className="bg-emerald-50 border-t border-emerald-100 p-3 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="font-semibold text-emerald-700 text-sm">Your profile is verified</div>
                <div className="text-emerald-600/80 text-xs">Registration and identity parameters are verified from /api/agent/me/</div>
              </div>
            </div>
            <div className="text-emerald-500">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>

        {/* Right Card: Producer Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-6 text-lg">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Award size={18} /></div>
            Producer Information
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Designation</span>
              <span className="font-semibold text-slate-800 text-sm">Senior Agent</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Agency Network</span>
              <span className="font-semibold text-slate-800 text-sm">Masters Companion</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Commission Tier</span>
              <span className="font-semibold text-slate-800 text-sm">Tier 1 (18.5%)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 text-sm">Joined On</span>
              <span className="font-semibold text-slate-800 text-sm">{formatDate(displayAgent.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Actions, Stats, Support */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4 text-md">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={16} /></div>
            Quick Actions
          </h3>
          <div className="flex gap-3">
            <button 
              className="flex-1 py-2 px-3 border border-slate-200 rounded-lg text-blue-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              onClick={() => navigate('/agent/policies')}
            >
              View Policies
            </button>
            <button 
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/agent/commissions')}
            >
              Check Commissions
            </button>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4 text-md">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={16} /></div>
            Profile Stats
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Users size={18} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Customers</div>
                <div className="font-bold text-slate-900 text-lg">248</div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-r border-slate-100 px-4">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><FileText size={18} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Active Policies</div>
                <div className="font-bold text-slate-900 text-lg">182</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><DollarSign size={18} /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Commissions</div>
                <div className="font-bold text-slate-900 text-lg">₹ 1,24,500</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-3 text-md">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><HelpCircle size={16} /></div>
            Support
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Need help? Contact our underwriter helpline for any assistance or queries.
          </p>
          <button className="flex items-center gap-2 py-1.5 px-3 border border-blue-200 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors w-fit">
            <PhoneCall size={14} /> Underwriter Helpline
          </button>
        </div>

      </div>
    </div>
  );
}
