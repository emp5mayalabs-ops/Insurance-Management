import { useState, useEffect } from 'react';
import { User, Mail, Phone, Hash, Calendar, MapPin, CreditCard } from 'lucide-react';
import { getCustomerMe } from '../../services/api';

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getCustomerMe();
        setCustomer(res.customer || res.data || res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!customer) return null;

  return (
    <div className="dashboard-content">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your personal and contact details</p>
        </div>
      </div>

      <div className="dash-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Basic Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Customer ID</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.customer_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Username</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.username}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Gender</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.gender}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Date of Birth</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.date_of_birth || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> Contact Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Email</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Phone</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={16} /> Identity Proof
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Aadhaar Number</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.aadhaar_number || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>PAN Number</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.pan_number || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} /> Address
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#0f172a', fontWeight: 500 }}>
              {customer.address_line1 && <div>{customer.address_line1}</div>}
              {customer.address_line2 && <div>{customer.address_line2}</div>}
              <div>
                {[customer.city, customer.state, customer.pincode].filter(Boolean).join(', ') || 'N/A'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
