import { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, User, Mail, Phone, Lock, Eye, EyeOff, Hash } from 'lucide-react';

export default function AgentModal({ isOpen, onClose, onSave, agent = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    agent_id: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (agent && isEditing) {
      setFormData({
        username: agent.username || '',
        password: '', // Blank by default on edit
        email: agent.email || '',
        agent_id: agent.agent_id || '',
        phone: agent.phone || ''
      });
    } else {
      setFormData({
        username: '',
        password: '',
        email: '',
        agent_id: '',
        phone: ''
      });
    }
    setErrors({});
    setShowPassword(false);
  }, [agent, isEditing, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) {
      errs.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email format';
    }
    if (!formData.agent_id.trim()) {
      errs.agent_id = 'Agent ID is required (e.g. AG001)';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required (e.g. 9876543210)';
    }
    if (!isEditing && !formData.password.trim()) {
      errs.password = 'Password is required for new agent';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Build payload matching exact backend contract
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        agent_id: formData.agent_id.trim(),
        phone: formData.phone.trim()
      };

      if (!isEditing) {
        payload.password = formData.password;
      } else if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Operation failed. Please check your inputs.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container form-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="modal-icon-badge">
              {isEditing ? <Edit3 size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3>{isEditing ? 'Edit Insurance Agent' : 'Create New Agent'}</h3>
              <p className="modal-subtitle">
                {isEditing
                  ? `Update credentials for agent ${agent?.agent_id || agent?.username}`
                  : 'Register a new agent account with login credentials'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="form-body">
            {errors.submit && (
              <div className="form-alert error">
                {errors.submit}
              </div>
            )}

            {/* Agent ID & Username */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="agent_id">
                  <Hash size={14} className="label-icon" /> Agent ID <span className="required-star">*</span>
                </label>
                <input
                  id="agent_id"
                  type="text"
                  name="agent_id"
                  value={formData.agent_id}
                  onChange={handleChange}
                  placeholder="e.g. AG001"
                  className={`form-input font-mono ${errors.agent_id ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.agent_id && <span className="field-error">{errors.agent_id}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">
                  <User size={14} className="label-icon" /> Username <span className="required-star">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. agent001"
                  className={`form-input ${errors.username ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.username && <span className="field-error">{errors.username}</span>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={14} className="label-icon" /> Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. agent001@example.com"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  <Phone size={14} className="label-icon" /> Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`form-input ${errors.phone ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <Lock size={14} className="label-icon" /> Password{' '}
                {isEditing ? (
                  <span className="text-xs text-slate-400 font-normal">(Leave blank to keep unchanged)</span>
                ) : (
                  <span className="required-star">*</span>
                )}
              </label>
              <div className="input-with-icon">
                <Lock size={17} className="input-prefix-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditing ? 'Enter new password if changing' : 'e.g. AgentPassword123'}
                  className={`form-input with-prefix with-suffix ${errors.password ? 'has-error' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : isEditing
                ? 'Save Agent Changes'
                : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
