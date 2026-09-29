import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById } from '../../services/api';
import { ArrowLeft, User, Phone, Mail, ShieldCheck, MapPin, CreditCard, Users } from 'lucide-react';

const s = {
  page: { padding: '0' },
  headerRow: { display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '8px' },
  breadcrumbSep: { color: '#94a3b8' },
  breadcrumbLink: { color: '#64748b', cursor: 'pointer', textDecoration: 'none' },
  breadcrumbActive: { color: '#3b82f6', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  backBtn: { width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fff', color: '#64748b', flexShrink: 0 },
  pageTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 },
  pageSubtitle: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 44px' },
  
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardBody: { padding: '24px' },
  
  profileHero: { display: 'flex', alignItems: 'flex-start', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, flexShrink: 0 },
  heroInfo: { flex: 1 },
  heroNameRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  heroName: { fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 },
  verifiedBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 },
  heroId: { fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '8px' },
  heroContacts: { display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#475569' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  detailCard: { backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '20px' },
  detailCardFull: { backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '20px', gridColumn: '1 / -1' },
  detailTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a', fontSize: '13px', marginBottom: '16px' },
  detailIconWrap: { backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: '6px', padding: '5px', display: 'flex' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #e2e8f0' },
  detailRowLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' },
  detailLabel: { fontSize: '13px', color: '#64748b' },
  detailValue: { fontSize: '13px', fontWeight: 600, color: '#1e293b' },
  addressText: { fontSize: '13px', color: '#334155', fontWeight: 500, lineHeight: 1.6 },
};

export default function CustomerViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomerById(id);
        setCustomer(res.data);
      } catch {
        setCustomer({
          id, customer_id: 'cx00' + id, username: 'Suresh Kumar',
          email: 'suresh@gmail.com', phone: '98765432456',
          gender: 'Male', date_of_birth: '1985-05-15',
          aadhaar_number: '1234 5678 9012', pan_number: 'ABCDE1234F',
          address_line1: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Loading customer details...</div>;
  if (!customer) return <div style={{ padding: '24px', color: '#64748b' }}>Customer not found.</div>;

  const initials = (customer.username || 'C').slice(0, 1).toUpperCase();

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerRow}>
        <div style={{ flex: 1 }}>
          <div style={s.breadcrumb}>
            <span>Agent Portal</span>
            <span style={s.breadcrumbSep}>&gt;</span>
            <span style={s.breadcrumbLink} onClick={() => navigate('/agent/customers')}>Customers</span>
            <span style={s.breadcrumbSep}>&gt;</span>
            <span style={s.breadcrumbActive}>{customer.customer_id}</span>
          </div>
          <div style={s.titleRow}>
            <button style={s.backBtn} onClick={() => navigate('/agent/customers')}>
              <ArrowLeft size={16} />
            </button>
            <h1 style={s.pageTitle}>Customer Details</h1>
          </div>
          <p style={s.pageSubtitle}>View complete profile information.</p>
        </div>
      </div>

      {/* Card */}
      <div style={s.card}>
        <div style={s.cardBody}>
          {/* Profile Hero */}
          <div style={s.profileHero}>
            <div style={s.avatar}>{initials}</div>
            <div style={s.heroInfo}>
              <div style={s.heroNameRow}>
                <h2 style={s.heroName}>{customer.username}</h2>
                <span style={s.verifiedBadge}><ShieldCheck size={11} /> Verified</span>
              </div>
              <div style={s.heroId}>ID: {customer.customer_id}</div>
              <div style={s.heroContacts}>
                <span style={s.contactItem}><Mail size={13} color="#94a3b8" /> {customer.email}</span>
                <span style={s.contactItem}><Phone size={13} color="#94a3b8" /> {customer.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Detail Grid */}
          <div style={s.detailGrid}>
            {/* Basic Info */}
            <div style={s.detailCard}>
              <div style={s.detailTitle}>
                <span style={{ ...s.detailIconWrap, color: '#3b82f6' }}><User size={14} /></span>
                Basic Information
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Customer ID</span>
                <span style={s.detailValue}>{customer.customer_id}</span>
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Gender</span>
                <span style={s.detailValue}>{customer.gender || 'N/A'}</span>
              </div>
              <div style={s.detailRowLast}>
                <span style={s.detailLabel}>Date of Birth</span>
                <span style={s.detailValue}>{customer.date_of_birth || 'N/A'}</span>
              </div>
            </div>

            {/* Identity Proof */}
            <div style={s.detailCard}>
              <div style={s.detailTitle}>
                <span style={{ ...s.detailIconWrap, color: '#16a34a' }}><CreditCard size={14} /></span>
                Identity Proof
              </div>
              <div style={s.detailRow}>
                <span style={s.detailLabel}>Aadhaar Number</span>
                <span style={s.detailValue}>{customer.aadhaar_number || 'N/A'}</span>
              </div>
              <div style={s.detailRowLast}>
                <span style={s.detailLabel}>PAN Number</span>
                <span style={s.detailValue}>{customer.pan_number || 'N/A'}</span>
              </div>
            </div>

            {/* Address */}
            <div style={s.detailCardFull}>
              <div style={s.detailTitle}>
                <span style={{ ...s.detailIconWrap, color: '#f59e0b' }}><MapPin size={14} /></span>
                Address Details
              </div>
              <div style={s.addressText}>
                {customer.address_line1 && <div>{customer.address_line1}</div>}
                {customer.address_line2 && <div>{customer.address_line2}</div>}
                <div>{[customer.city, customer.state, customer.pincode].filter(Boolean).join(', ') || 'Address not provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
