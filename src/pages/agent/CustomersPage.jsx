import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/api';
import CustomerModal from '../../components/CustomerModal';
import { Users, Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = () => {
    setSelectedCustomer(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateCustomer(selectedCustomer.id, data);
      } else {
        await createCustomer(data);
      }
      fetchCustomers();
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <div className="p-4">Loading customers...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="dash-card">
      <div className="dash-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} className="text-emerald-600" />
            My Customers
          </h2>
          <p className="dash-card-subtitle">Manage your registered customers.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>ID</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Email</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No customers found.</td>
              </tr>
            ) : (
              customers.map(cust => (
                <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', color: '#0f172a', fontWeight: 500 }}>{cust.customer_id}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#0f172a' }}>{cust.username}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{cust.email}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{cust.phone || 'N/A'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/agent/customers/${cust.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9' }} title="View">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEdit(cust)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eab308' }} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cust.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomerModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        customer={selectedCustomer}
        isEditing={isEditing}
      />
    </div>
  );
}
