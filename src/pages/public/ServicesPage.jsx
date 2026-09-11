import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const services = [
  {
    icon: '❤️',
    title: 'Life Insurance',
    plans: ['Term Life Plan', 'Whole Life Plan', 'Endowment Plan', 'ULIP'],
    desc: 'Choose from pure protection term plans or savings-linked policies. Our life insurance plans offer coverage up to ₹5 Crore with premiums starting at just ₹499/month.',
    features: ['Sum assured up to ₹5 Crore', 'Premiums from ₹499/month', 'Tax benefit u/s 80C', 'Free health checkup included'],
    color: '#e11d48',
  },
  {
    icon: '🏥',
    title: 'Health Insurance',
    plans: ['Individual Health Plan', 'Family Floater', 'Senior Citizen Plan', 'Critical Illness Cover'],
    desc: 'Cashless treatment at 10,000+ network hospitals. Our health plans cover hospitalization, day-care procedures, ambulance charges, and post-hospitalization expenses.',
    features: ['Cashless at 10,000+ hospitals', 'No room rent capping', 'Mental health cover included', 'Annual health checkup free'],
    color: '#2563eb',
  },
  {
    icon: '🚗',
    title: 'Motor Insurance',
    plans: ['Car Insurance', 'Two-Wheeler Insurance', 'Commercial Vehicle', 'Third Party Only'],
    desc: 'Comprehensive motor coverage with zero depreciation add-on, roadside assistance, and cashless repairs at 5,000+ authorized garages across India.',
    features: ['Zero depreciation add-on', '5,000+ cashless garages', '24x7 roadside assistance', 'Instant claim intimation'],
    color: '#0d9488',
  },
  {
    icon: '🏠',
    title: 'Home Insurance',
    plans: ['Standard Fire Policy', "Householder's Package", "Renter's Insurance", 'Landlord Policy'],
    desc: 'All-risk home insurance covering structure, contents, and personal belongings against fire, flood, earthquake, theft, and burglary.',
    features: ['Structure + contents cover', 'Natural calamity protection', 'Burglary and theft cover', 'Temporary accommodation benefit'],
    color: '#7c3aed',
  },
  {
    icon: '✈️',
    title: 'Travel Insurance',
    plans: ['Domestic Travel', 'International Travel', 'Student Travel', 'Corporate Travel'],
    desc: 'Worry-free travel with comprehensive plans covering medical emergencies, trip cancellations, lost passport, missed flights, and baggage loss.',
    features: ['Medical cover up to $500,000', 'Trip cancellation refund', 'Lost baggage compensation', 'Emergency evacuation cover'],
    color: '#d97706',
  },
  {
    icon: '💼',
    title: 'Business Insurance',
    plans: ['SME Package Policy', 'Professional Liability', 'Marine Cargo', 'Workmen\'s Compensation'],
    desc: 'Protect your business from financial loss with tailored commercial insurance including fire, liability, marine, and employee benefit solutions.',
    features: ['Business interruption cover', 'Directors & Officers liability', 'Cyber risk protection', 'Inventory and stock coverage'],
    color: '#059669',
  },
];

export default function ServicesPage() {
  return (
    <div className="site-page">
      <SiteHeader />

      {/* Hero */}
      <section className="site-page-hero">
        <div className="site-container">
          <div className="site-section-badge">Our Products</div>
          <h1 className="site-page-hero-title">Comprehensive Insurance Solutions</h1>
          <p className="site-page-hero-sub">
            Every life stage, every risk, every need — Masters Companion has the right plan for
            you. Explore our full portfolio of life, health, motor, home, travel, and business
            insurance products.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-services-list">
            {services.map((svc, i) => (
              <div
                key={svc.title}
                className={`site-service-detail${i % 2 !== 0 ? ' reverse' : ''}`}
              >
                <div className="site-svc-visual" style={{ '--svc-color': svc.color }}>
                  <div className="site-svc-big-icon">{svc.icon}</div>
                  <div className="site-svc-plans">
                    {svc.plans.map((p) => (
                      <span key={p} className="site-svc-plan-tag">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="site-svc-content">
                  <h2 className="site-svc-title">{svc.title}</h2>
                  <p className="site-svc-desc">{svc.desc}</p>
                  <ul className="site-svc-features">
                    {svc.features.map((f) => (
                      <li key={f}>
                        <span className="site-svc-check">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="site-btn-primary" style={{ marginTop: '1.5rem' }}>
                    Get a Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
