import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const team = [
  {
    name: 'Mr. Suresh Babu Nair',
    role: 'Founder & Chairman',
    bio: 'A visionary leader with 35 years in financial services, Mr. Nair founded Masters Companion in 1998 with a simple mission: make insurance accessible and trustworthy for every Indian family.',
    avatar: 'SN',
  },
  {
    name: 'Mrs. Kavitha Rajan',
    role: 'Managing Director & CEO',
    bio: 'With an MBA from IIM-A and 22 years of industry experience, Kavitha drives our digital transformation strategy, leading a team of 3,000+ professionals across India.',
    avatar: 'KR',
  },
  {
    name: 'Mr. Arun Menon',
    role: 'Chief Actuarial Officer',
    bio: 'A Fellow of the Institute of Actuaries of India (FIAI) with 18 years of expertise in risk modeling, Arun ensures our products remain competitively priced while maintaining solvency.',
    avatar: 'AM',
  },
  {
    name: 'Ms. Deepa Krishnamurthy',
    role: 'Chief Claims Officer',
    bio: 'Deepa pioneered our 48-hour claim settlement process, reducing average turnaround by 70% through automation and empathetic customer service protocols.',
    avatar: 'DK',
  },
];

const milestones = [
  { year: '1998', event: 'Founded in Bangalore with a focus on life and health insurance for working families.' },
  { year: '2003', event: 'Crossed 5,000 policyholders; expanded into motor and property insurance segments.' },
  { year: '2008', event: 'Launched our pan-India branch network with 50+ offices across 15 states.' },
  { year: '2012', event: 'Received IRDAI\'s Best Emerging Insurer Award; crossed ₹100Cr in annual premiums.' },
  { year: '2016', event: 'Launched digital platform enabling 24x7 policy purchase and renewal online.' },
  { year: '2019', event: 'Crossed 30,000 customers; settled over ₹1,000Cr in cumulative claims.' },
  { year: '2022', event: 'Introduced AI-powered claim assessment reducing settlement time to under 48 hours.' },
  { year: '2024', event: 'Awarded "Best Insurer of the Year" by Economic Times; crossed 50,000 policyholders.' },
];

export default function AboutPage() {
  return (
    <div className="site-page">
      <SiteHeader />

      {/* Hero */}
      <section className="site-page-hero">
        <div className="site-container">
          <div className="site-section-badge">Our Story</div>
          <h1 className="site-page-hero-title">About Masters Companion</h1>
          <p className="site-page-hero-sub">
            For over 26 years, we have been the silent guardian behind India's most important
            life decisions — marriages, mortgages, milestones, and everything in between.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-mv-grid">
            <div className="site-mv-card">
              <div className="site-mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To make comprehensive, affordable, and transparent insurance accessible to every
                Indian — from metro cities to the remotest village — and to settle every genuine
                claim with speed, empathy, and integrity.
              </p>
            </div>
            <div className="site-mv-card">
              <div className="site-mv-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>
                To be India's most trusted insurance companion — recognized not by the number of
                policies sold, but by the lives we protect, the families we stabilize, and the
                futures we secure.
              </p>
            </div>
            <div className="site-mv-card">
              <div className="site-mv-icon">💎</div>
              <h3>Our Values</h3>
              <p>
                Transparency, Empathy, Excellence, and Innovation are at the heart of everything
                we do — from product design to claim settlement, every interaction is guided by
                these pillars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="site-section site-section-alt">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Our Journey</div>
            <h2 className="site-section-title">26 Years of Growth &amp; Trust</h2>
          </div>
          <div className="site-timeline">
            {milestones.map((m, i) => (
              <div key={m.year} className={`site-timeline-item${i % 2 === 0 ? ' left' : ' right'}`}>
                <div className="site-timeline-dot" />
                <div className="site-timeline-card">
                  <div className="site-timeline-year">{m.year}</div>
                  <p>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Leadership</div>
            <h2 className="site-section-title">The People Behind Our Promise</h2>
          </div>
          <div className="site-team-grid">
            {team.map((m) => (
              <div key={m.name} className="site-team-card">
                <div className="site-team-avatar">{m.avatar}</div>
                <h3 className="site-team-name">{m.name}</h3>
                <div className="site-team-role">{m.role}</div>
                <p className="site-team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
