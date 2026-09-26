import { useState, useEffect } from 'react';

export default function AgentModal({ isOpen, onClose, onSave, agent = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    agent_id: '',
    phone: '',
    aadhaar_number: '',
    pan_number: '',
    insurance_company: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (agent && isEditing) {
      setFormData({
        username: agent.username || '',
        password: '',
        email: agent.email || '',
        agent_id: agent.agent_id || '',
        phone: agent.phone || '',
        aadhaar_number: agent.aadhaar_number || '',
        pan_number: agent.pan_number || '',
        insurance_company: agent.insurance_company || '',
        address_line1: agent.address_line1 || '',
        address_line2: agent.address_line2 || '',
        city: agent.city || '',
        state: agent.state || '',
        pincode: agent.pincode || ''
      });
    } else {
      setFormData({
        username: '',
        password: '',
        email: '',
        agent_id: '',
        phone: '',
        aadhaar_number: '',
        pan_number: '',
        insurance_company: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: ''
      });
    }
    setErrors({});
  }, [agent, isEditing, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'required';
    if (!formData.email.trim()) errs.email = 'required';
    if (!formData.agent_id.trim()) errs.agent_id = 'required';
    if (!isEditing && !formData.password.trim()) errs.password = 'required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (isEditing && !payload.password) delete payload.password;
      await onSave(payload);
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || 'Operation failed' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { backgroundColor: '#F8F5E6', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem 3rem', position: 'relative', color: '#3B2F2F', fontFamily: '"Times New Roman", Times, serif' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #C8B89C', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' },
    sectionTitle: { fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 'bold', margin: 0, color: '#4A3B32' },
    sectionSubtitle: { fontSize: '0.8rem', letterSpacing: '1px', color: '#8C7A6B' },
    row: { display: 'flex', gap: '2rem', marginBottom: '1.5rem' },
    group: { flex: 1, display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5rem', color: '#4A3B32', textTransform: 'uppercase' },
    input: { background: 'transparent', border: 'none', borderBottom: '1px dashed #C8B89C', padding: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#6B5A4B', outline: 'none', fontFamily: '"Georgia", serif' },
    hint: { fontSize: '0.7rem', color: '#A09383', marginTop: '0.3rem', fontStyle: 'italic' },
    radioGroup: { display: 'flex', gap: '1rem' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #D8C8AC', backgroundColor: '#F0EAD6', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', color: '#4A3B32' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px solid #3B2F2F' },
    btnSecondary: { padding: '0.8rem 2rem', backgroundColor: 'transparent', border: '1px solid #C8B89C', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', color: '#4A3B32' },
    btnPrimary: { padding: '0.8rem 2rem', backgroundColor: '#3B2F2F', border: 'none', color: '#F8F5E6', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' },
    errorText: { color: '#8B0000', fontSize: '0.75rem', marginTop: '0.2rem' },
    symbol: { marginRight: '8px', color: '#C8B89C' }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {errors.submit && <div style={{ color: '#8B0000', marginBottom: '1rem' }}>{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}><span style={styles.symbol}>§</span> ACCOUNT CREDENTIALS</h3>
            <span style={styles.sectionSubtitle}>SECTION I</span>
          </div>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>USERNAME <span style={{color: '#8B0000'}}>*</span></label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. john_agent" style={styles.input} />
              <span style={styles.hint}>must be unique</span>
              {errors.username && <span style={styles.errorText}>{errors.username}</span>}
            </div>
            <div style={styles.group}>
              <label style={styles.label}>PASSWORD <span style={{color: '#8B0000'}}>*</span></label>
              <input type={isEditing ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? "leave blank to keep" : "minimum 8 characters"} style={styles.input} />
              <span style={styles.hint}>min 8 characters</span>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>EMAIL ADDRESS <span style={{color: '#8B0000'}}>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="agent@example.com" style={styles.input} />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>
          </div>

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}><span style={styles.symbol}>§</span> AGENT PARTICULARS</h3>
            <span style={styles.sectionSubtitle}>SECTION II</span>
          </div>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>AGENT ID <span style={{color: '#8B0000'}}>*</span></label>
              <input type="text" name="agent_id" value={formData.agent_id} onChange={handleChange} placeholder="e.g. AGT-001" style={styles.input} />
              <span style={styles.hint}>assigned by agency</span>
              {errors.agent_id && <span style={styles.errorText}>{errors.agent_id}</span>}
            </div>
            <div style={styles.group}>
              <label style={styles.label}>PHONE NUMBER</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" style={styles.input} />
            </div>
          </div>

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}><span style={styles.symbol}>§</span> IDENTITY PROOF</h3>
            <span style={styles.sectionSubtitle}>SECTION III</span>
          </div>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>AADHAAR NUMBER</label>
              <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="0000 0000 0000" style={styles.input} />
              <span style={styles.hint}>12 digits</span>
            </div>
            <div style={styles.group}>
              <label style={styles.label}>PAN NUMBER</label>
              <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} placeholder="ABCDE1234F" style={styles.input} />
              <span style={styles.hint}>format: ABCDE1234F</span>
            </div>
          </div>

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}><span style={styles.symbol}>§</span> INSURANCE COMPANY</h3>
            <span style={styles.sectionSubtitle}>SECTION IV</span>
          </div>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>SELECT COMPANY</label>
              <div style={styles.radioGroup}>
                {[
                  { value: 'ICICI', label: 'ICICI Lombard' },
                  { value: 'STAR', label: 'Star Health' },
                  { value: 'NIVA_BUPA', label: 'Niva Bupa' }
                ].map(company => (
                  <label key={company.value} style={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="insurance_company" 
                      value={company.value} 
                      checked={formData.insurance_company === company.value} 
                      onChange={handleChange} 
                      style={{ accentColor: '#3B2F2F' }} 
                    />
                    {company.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}><span style={styles.symbol}>§</span> RESIDENTIAL ADDRESS</h3>
            <span style={styles.sectionSubtitle}>SECTION V</span>
          </div>
          
          <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #C8B89C' }}>
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>ADDRESS LINE 1</label>
                <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} placeholder="House / Building / Street" style={styles.input} />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>ADDRESS LINE 2</label>
                <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} placeholder="Area / Landmark (optional)" style={styles.input} />
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.group}>
                <label style={styles.label}>CITY</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai" style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>STATE</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Maharashtra" style={styles.input} />
              </div>
              <div style={styles.group}>
                <label style={styles.label}>PINCODE</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="000000" style={styles.input} />
                <span style={styles.hint}>6 digits</span>
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.btnSecondary} disabled={isSubmitting}>CLEAR</button>
            <button type="submit" style={styles.btnPrimary} disabled={isSubmitting}>{isSubmitting ? 'SAVING...' : (isEditing ? 'UPDATE AGENT' : 'REGISTER AGENT')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
