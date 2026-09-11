import { useState } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="site-page">
      <SiteHeader />

      {/* Hero */}
      <section className="site-page-hero">
        <div className="site-container">
          <div className="site-section-badge">Get in Touch</div>
          <h1 className="site-page-hero-title">Contact Us</h1>
          <p className="site-page-hero-sub">
            Have a question about a policy, need help with a claim, or want to speak with an agent?
            Our team is available Monday to Saturday, 9 AM to 7 PM.
          </p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <div className="site-contact-grid">
            {/* Info */}
            <div className="site-contact-info">
              <h3>Reach Us Directly</h3>
              <div className="site-contact-items">
                {[
                  { icon: '📞', label: 'Toll-Free Helpline', val: '1800-123-4567', note: 'Mon–Sat, 9 AM–7 PM' },
                  { icon: '✉️', label: 'Email Support', val: 'support@masterscompanion.in', note: 'Response within 4 hours' },
                  { icon: '💬', label: 'Live Chat', val: 'Available on our App', note: '24x7 AI + Human Support' },
                  { icon: '📍', label: 'Head Office', val: '42, Masters Tower, MG Road', note: 'Bangalore – 560001, Karnataka' },
                ].map((item) => (
                  <div key={item.label} className="site-contact-item">
                    <div className="site-contact-icon">{item.icon}</div>
                    <div>
                      <div className="site-contact-label">{item.label}</div>
                      <div className="site-contact-val">{item.val}</div>
                      <div className="site-contact-note">{item.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="site-contact-branches">
                <h4>Regional Offices</h4>
                {['Mumbai · Chennai · Hyderabad · Delhi · Pune · Kolkata'].map((b) => (
                  <p key={b} className="site-contact-branch-note">{b}</p>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="site-contact-form-card">
              {sent ? (
                <div className="site-contact-success">
                  <div className="site-contact-success-icon">✅</div>
                  <h3>Message Received!</h3>
                  <p>
                    Thank you for reaching out, <strong>{form.name}</strong>. Our team will get
                    back to you at <strong>{form.email}</strong> within 4 business hours.
                  </p>
                </div>
              ) : (
                <>
                  <h3>Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="site-contact-form">
                    <div className="site-form-row">
                      <div className="site-form-group">
                        <label>Full Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Rajesh Kumar"
                          required
                        />
                      </div>
                      <div className="site-form-group">
                        <label>Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="rajesh@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="site-form-row">
                      <div className="site-form-group">
                        <label>Phone Number</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                        />
                      </div>
                      <div className="site-form-group">
                        <label>Subject *</label>
                        <select name="subject" value={form.subject} onChange={handleChange} required>
                          <option value="">Select topic</option>
                          <option>Policy Enquiry</option>
                          <option>Claim Assistance</option>
                          <option>Premium Payment</option>
                          <option>Policy Renewal</option>
                          <option>Agent Support</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="site-form-group">
                      <label>Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe your query in detail..."
                        required
                      />
                    </div>
                    <button type="submit" className="site-btn-primary" style={{ width: '100%' }}>
                      Send Message →
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
