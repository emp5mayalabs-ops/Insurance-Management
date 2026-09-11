import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const stats = [
  { number: '50,000+', label: 'Happy Customers' },
  { number: '26+', label: 'Years of Service' },
  { number: '₹2,000Cr+', label: 'Claims Settled' },
  { number: '99.2%', label: 'Customer Satisfaction' },
];

const services = [
  {
    icon: '❤️',
    title: 'Life Insurance',
    desc: 'Comprehensive life cover plans to safeguard your family\'s financial future with flexible premiums and high sum assured.',
  },
  {
    icon: '🏥',
    title: 'Health & Medical',
    desc: 'Individual and family floater plans with cashless hospitalization across 10,000+ network hospitals nationwide.',
  },
  {
    icon: '🚗',
    title: 'Motor Insurance',
    desc: 'Third-party and comprehensive policies for cars and two-wheelers with instant online renewal and 24x7 roadside assistance.',
  },
  {
    icon: '🏠',
    title: 'Home & Property',
    desc: 'Protect your home from fire, floods, theft, and natural calamities with our all-risk property insurance solutions.',
  },
  {
    icon: '✈️',
    title: 'Travel Insurance',
    desc: 'Domestic and international travel plans covering medical emergencies, trip cancellations, and lost baggage.',
  },
  {
    icon: '💼',
    title: 'Business Insurance',
    desc: 'Tailored commercial solutions including liability, workers\' compensation, fire, and marine cargo insurance.',
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Small Business Owner, Delhi',
    text: 'Masters Companion settled my fire insurance claim within 48 hours of filing. The process was seamless and the team was incredibly supportive during a very difficult time.',
    avatar: 'RK',
  },
  {
    name: 'Priya Sharma',
    role: 'Teacher, Bangalore',
    text: 'I have been with Masters Companion for 12 years now. Their health plan covered my mother\'s surgery fully — not a single rupee out of pocket. Truly a companion in need!',
    avatar: 'PS',
  },
  {
    name: 'Mohammed Irfan',
    role: 'Software Engineer, Hyderabad',
    text: 'Got my motor insurance renewed in under 5 minutes on the app. When I had a minor accident, the claim was approved the same day. Outstanding service!',
    avatar: 'MI',
  },
];

export default function HomePage() {
  return (
    <div className="site-page">
      <SiteHeader />

      {/* Hero Section */}
      <section className="site-hero">
        <div className="site-hero-bg" />
        <div className="site-container">
          <div className="site-hero-content">
            <div className="site-hero-badge">🛡️ IRDAI Registered · Licence No. 124</div>
            <h1 className="site-hero-title">
              Your Trusted <span className="site-hero-highlight">Companion</span>
              <br />for Every Risk in Life
            </h1>
            <p className="site-hero-subtitle">
              Masters Companion has been protecting Indian families and businesses for over 26 years.
              Comprehensive insurance solutions, transparent policies, and lightning-fast claim
              settlements — all under one roof.
            </p>
            <div className="site-hero-actions">
              <Link to="/login" className="site-btn-primary-lg">
                Get a Free Quote →
              </Link>
              <a href="#services" className="site-btn-outline-lg">
                Explore Plans
              </a>
            </div>
            <div className="site-hero-trust">
              <span>✅ Zero hidden charges</span>
              <span>✅ Instant policy issuance</span>
              <span>✅ 24x7 Claims Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="site-stats-bar">
        <div className="site-container">
          <div className="site-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="site-stat-item">
                <span className="site-stat-number">{s.number}</span>
                <span className="site-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="site-section" id="services">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Our Products</div>
            <h2 className="site-section-title">Insurance Solutions for Every Stage of Life</h2>
            <p className="site-section-subtitle">
              From your first vehicle to your family home, from health to wealth — we have a plan
              that fits perfectly.
            </p>
          </div>
          <div className="site-services-grid">
            {services.map((svc) => (
              <div key={svc.title} className="site-service-card">
                <div className="site-service-icon">{svc.icon}</div>
                <h3 className="site-service-title">{svc.title}</h3>
                <p className="site-service-desc">{svc.desc}</p>
                <a href="#" className="site-service-link">
                  Learn more →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="site-section site-section-alt">
        <div className="site-container">
          <div className="site-why-grid">
            <div className="site-why-content">
              <div className="site-section-badge">Why Masters Companion?</div>
              <h2 className="site-section-title" style={{ textAlign: 'left' }}>
                26 Years of Trust, One Commitment
              </h2>
              <p className="site-section-subtitle" style={{ textAlign: 'left' }}>
                We are not just an insurer — we are your financial companion, standing by you when
                life takes an unexpected turn.
              </p>
              <div className="site-why-points">
                {[
                  { icon: '⚡', title: '48-Hour Claim Settlement', desc: 'Industry-leading claim turnaround time with digital documentation.' },
                  { icon: '🔒', title: 'No Hidden Charges', desc: 'Complete transparency on premiums, deductibles and policy terms.' },
                  { icon: '🌐', title: 'Pan-India Network', desc: '500+ branches and 10,000+ hospital and garage tie-ups.' },
                  { icon: '📱', title: 'Digital-First Experience', desc: 'Buy, renew, and claim online 24x7 via app or website.' },
                ].map((p) => (
                  <div key={p.title} className="site-why-point">
                    <div className="site-why-point-icon">{p.icon}</div>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="site-why-visual">
              <div className="site-why-card-stack">
                <div className="site-why-float-card wfc-1">
                  <span>🏆</span>
                  <div>
                    <strong>Best Insurer 2024</strong>
                    <small>Economic Times Awards</small>
                  </div>
                </div>
                <div className="site-why-float-card wfc-2">
                  <span>⭐</span>
                  <div>
                    <strong>4.8 / 5 Rating</strong>
                    <small>50,000+ customer reviews</small>
                  </div>
                </div>
                <div className="site-why-center-badge">
                  <div className="site-why-badge-number">₹2000Cr+</div>
                  <div className="site-why-badge-label">Total Claims Settled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Testimonials</div>
            <h2 className="site-section-title">What Our Customers Say</h2>
          </div>
          <div className="site-testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="site-testimonial-card">
                <div className="site-testimonial-stars">★★★★★</div>
                <p className="site-testimonial-text">"{t.text}"</p>
                <div className="site-testimonial-author">
                  <div className="site-testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="site-cta-banner">
        <div className="site-container">
          <div className="site-cta-content">
            <h2>Ready to Secure Your Future?</h2>
            <p>Get a personalized insurance quote in under 2 minutes. No paperwork, no hassle.</p>
            <div className="site-cta-actions">
              <Link to="/login" className="site-btn-white-lg">
                Get a Free Quote Today
              </Link>
              <a href="tel:18001234567" className="site-btn-outline-white-lg">
                📞 Call 1800-123-4567
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
