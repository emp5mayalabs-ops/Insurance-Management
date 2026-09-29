import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../services/api';
import CustomerModal from '../../components/CustomerModal';
import { Users, Plus, Edit2, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const s = {
  page: { padding: '0' },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  breadcrumbSep: { color: '#94a3b8' },
  breadcrumbActive: { color: '#3b82f6', fontWeight: 600 },
  pageTitle: { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 },
  pageSubtitle: { fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' },

  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },

  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px', minWidth: '300px', backgroundColor: '#fafafa' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#374151', width: '100%' },
  filterBtn: { display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' },

  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' },
  thead: { backgroundColor: '#f8fafc' },
  th: { padding: '12px 20px', fontWeight: 600, color: '#64748b', fontSize: '12px', borderBottom: '1px solid #e2e8f0' },
  tdId: { padding: '14px 20px', color: '#64748b', fontWeight: 600 },
  tdName: { padding: '14px 20px' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  nameAvatar: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', flexShrink: 0 },
  nameText: { fontWeight: 500, color: '#334155' },
  tdEmail: { padding: '14px 20px', color: '#3b82f6' },
  tdPhone: { padding: '14px 20px', color: '#475569', fontWeight: 500 },
  tdActions: { padding: '14px 20px' },
  actionBtns: { display: 'flex', gap: '8px' },
  viewBtn: { backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex' },
  editBtn: { backgroundColor: '#fffbeb', color: '#d97706', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex' },
  deleteBtn: { backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex' },

  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f1f5f9', fontSize: '13px', color: '#64748b' },
  pagination: { display: 'flex', alignItems: 'center', gap: '4px' },
  pageBtn: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151', backgroundColor: '#fff' },
  pageBtnActive: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid #3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', backgroundColor: '#3b82f6' },
  pageBtnArrow: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#94a3b8', backgroundColor: '#fff' },
  pageBtnArrowDisabled: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid #f1f5f9', cursor: 'not-allowed', color: '#e2e8f0', backgroundColor: '#fafafa' },
};

const AVATAR_COLORS = [
  ['#dbeafe', '#1d4ed8'], ['#fce7f3', '#be185d'], ['#dcfce7', '#15803d'],
  ['#fef3c7', '#b45309'], ['#ede9fe', '#7c3aed'],
];

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      if (res && res.data && res.data.length > 0) {
        setAllCustomers(res.data);
      } else {
        setAllCustomers([]);
      }
    } catch {
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  // Reset to page 1 whenever search query changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // Filter by search query
  const filteredCustomers = allCustomers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.username || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.customer_id || '').toLowerCase().includes(q)
    );
  });

  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalCustomers / PAGE_SIZE));

  // Clamp currentPage if it goes out of range after filter/delete
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalCustomers);
  const pageCustomers = filteredCustomers.slice(startIdx, endIdx);

  // Build page number buttons (show max 5 around current page)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleCreate = () => { setSelectedCustomer(null); setIsEditing(false); setModalOpen(true); };
  const handleEdit = (c) => { setSelectedCustomer(c); setIsEditing(true); setModalOpen(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      try {
        await deleteCustomer(id);
        await fetchCustomers();
        // If last item on this page was deleted, go back one page
        const newTotal = allCustomers.length - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
        if (safePage > newTotalPages) setCurrentPage(newTotalPages);
      } catch (err) { alert(err.message); }
    }
  };
  const handleSave = async (data) => {
    if (isEditing) await updateCustomer(selectedCustomer.id, data);
    else await createCustomer(data);
    await fetchCustomers();
  };

  const getInitials = (name) => (name || 'C').slice(0, 1).toUpperCase();
  const getAvatarColors = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

  if (loading) return <div style={{ padding: '24px', color: '#64748b' }}>Loading customers...</div>;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.headerRow}>
        <div>
          <div style={s.breadcrumb}>
            <span>Agent Portal</span>
            <span style={s.breadcrumbSep}>&gt;</span>
            <span style={s.breadcrumbActive}>Customers</span>
          </div>
          <h1 style={s.pageTitle}>My Customers</h1>
          <p style={s.pageSubtitle}>Manage your registered customers.</p>
        </div>
        <button style={s.addBtn} onClick={handleCreate}>
          <Plus size={15} /> Add Customer
        </button>
      </div>

      <div style={s.card}>
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchBox}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              style={s.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={s.filterBtn}>
            All <ChevronDown size={14} color="#94a3b8" style={{ marginLeft: 4 }} />
          </div>
          <div style={s.filterBtn}>
            <Filter size={14} color="#64748b" /> Filter
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead style={s.thead}>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    {searchQuery ? 'No customers match your search.' : 'No customers found.'}
                  </td>
                </tr>
              ) : (
                pageCustomers.map((cust, idx) => {
                  const globalIdx = startIdx + idx;
                  const [bg, fg] = getAvatarColors(globalIdx);
                  return (
                    <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={s.tdId}>{cust.customer_id}</td>
                      <td style={s.tdName}>
                        <div style={s.nameCell}>
                          <div style={{ ...s.nameAvatar, backgroundColor: bg, color: fg }}>
                            {getInitials(cust.username)}
                          </div>
                          <span style={s.nameText}>{cust.username}</span>
                        </div>
                      </td>
                      <td style={s.tdEmail}>{cust.email}</td>
                      <td style={s.tdPhone}>{cust.phone || 'N/A'}</td>
                      <td style={s.tdActions}>
                        <div style={s.actionBtns}>
                          <button style={s.viewBtn} onClick={() => navigate(`/agent/customers/${cust.id}`)} title="View">
                            <Eye size={16} />
                          </button>
                          <button style={s.editBtn} onClick={() => handleEdit(cust)} title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button style={s.deleteBtn} onClick={() => handleDelete(cust.id)} title="Delete">
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

        {/* Pagination Footer */}
        <div style={s.footer}>
          <span>
            {totalCustomers === 0
              ? 'No customers'
              : `Showing ${startIdx + 1}–${endIdx} of ${totalCustomers} customer${totalCustomers !== 1 ? 's' : ''}`}
          </span>
          {totalPages > 1 && (
            <div style={s.pagination}>
              {/* Prev */}
              <button
                style={safePage === 1 ? s.pageBtnArrowDisabled : s.pageBtnArrow}
                onClick={() => safePage > 1 && setCurrentPage(safePage - 1)}
                disabled={safePage === 1}
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map(n => (
                <button
                  key={n}
                  style={n === safePage ? s.pageBtnActive : s.pageBtn}
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              ))}

              {/* Next */}
              <button
                style={safePage === totalPages ? s.pageBtnArrowDisabled : s.pageBtnArrow}
                onClick={() => safePage < totalPages && setCurrentPage(safePage + 1)}
                disabled={safePage === totalPages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
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
