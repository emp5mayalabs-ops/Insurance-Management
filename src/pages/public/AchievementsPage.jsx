import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const awards = [
  {
    year: '2024',
    title: 'Best Insurer of the Year',
    org: 'Economic Times Insurance Summit',
    icon: '🏆',
    desc: 'Recognized for outstanding claims settlement ratio and customer satisfaction scores above 99% for three consecutive years.',
  },
  {
    year: '2023',
    title: 'Digital Innovation Award',
    org: 'NASSCOM Fintech Forum',
    icon: '💡',
    desc: 'Awarded for our AI-powered claim automation platform that reduced processing time from 15 days to under 48 hours.',
  },
  {
    year: '2022',
    title: 'Great Place to Work® Certified',
    org: 'Great Place to Work® Institute India',
    icon: '👥',
    desc: 'Certified for excellence in employee culture, well-being programs, and career development opportunities.',
  },
  {
    year: '2021',
    title: 'Customer Centricity Excellence Award',
    org: 'BFSI Sector Skills Council',
    icon: '❤️',
    desc: 'Honored for our 24x7 multilingual customer support initiative serving customers in 12 regional languages.',
  },
  {
    year: '2019',
    title: 'Most Trusted Insurance Brand',
    org: 'Brand Trust Report India',
    icon: '⭐',
    desc: 'Ranked #1 in the Most Trusted Insurance Brand survey conducted across 20 cities with 100,000+ respondents.',
  },
  {
    year: '2017',
    title: 'IRDAI Best Practices Award',
    org: 'Insurance Regulatory and Development Authority of India',
    icon: '🎖️',
    desc: 'Recognized by IRDAI for exemplary compliance, consumer protection standards, and policyholder grievance redressal.',
  },
];

const achievements = [
  { icon: '👨‍👩‍👧‍👦', number: '50,000+', label: 'Families Protected', detail: 'Across 28 states and 4 union territories' },
  { icon: '💰', number: '₹2,000Cr+', label: 'Total Claims Paid', detail: 'Since inception in 1998' },
  { icon: '🏢', number: '500+', label: 'Branch Offices', detail: 'Covering every major city and district' },
  { icon: '🏥', number: '10,000+', label: 'Network Hospitals', detail: 'For cashless health coverage' },
  { icon: '🔧', number: '5,000+', label: 'Authorised Garages', detail: 'For cashless motor repairs' },
  { icon: '📱', number: '2 Min', label: 'Policy Issuance', detail: 'Digital-first instant policy delivery' },
  { icon: '⚡', number: '48 Hrs', label: 'Claim Settlement', detail: 'Industry-leading turnaround time' },
  { icon: '😊', number: '99.2%', label: 'CSAT Score', detail: 'Based on 1.2L+ post-claim surveys' },
];

const certifications = [
  { name: 'ISO 9001:2015', desc: 'Quality Management System' },
  { name: 'ISO 27001:2022', desc: 'Information Security Management' },
  { name: 'IRDAI Licence No. 124', desc: 'Insurance Regulatory Authority of India' },
  { name: 'CMMI Level 3', desc: 'Software Process Maturity' },
  { name: 'PCI-DSS Compliant', desc: 'Payment Card Industry Data Security' },
  { name: 'SOC 2 Type II', desc: 'Security, Availability, Confidentiality' },
];

export default function AchievementsPage() {
  return (
    <div className="site-page">
      <SiteHeader />

      {/* Hero */}
      <section className="site-page-hero">
        <div className="site-container">
          <div className="site-section-badge">Recognition &amp; Milestones</div>
          <h1 className="site-page-hero-title">Our Achievements</h1>
          <p className="site-page-hero-sub">
            26 years of hard work, innovation, and unwavering commitment to our customers —
            recognized by industry bodies, government regulators, and most importantly, our
            policyholders.
          </p>
        </div>
      </section>

      {/* Key Numbers */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">By the Numbers</div>
            <h2 className="site-section-title">The Impact We Have Made</h2>
          </div>
          <div className="site-achievements-grid">
            {achievements.map((a) => (
              <div key={a.label} className="site-achievement-card">
                <div className="site-achievement-icon">{a.icon}</div>
                <div className="site-achievement-number">{a.number}</div>
                <div className="site-achievement-label">{a.label}</div>
                <div className="site-achievement-detail">{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="site-section site-section-alt">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Awards &amp; Honors</div>
            <h2 className="site-section-title">Industry Recognition</h2>
            <p className="site-section-subtitle">
              Our commitment to excellence has been acknowledged by India's most prestigious
              organizations.
            </p>
          </div>
          <div className="site-awards-grid">
            {awards.map((a) => (
              <div key={a.title} className="site-award-card">
                <div className="site-award-top">
                  <div className="site-award-icon">{a.icon}</div>
                  <div className="site-award-year">{a.year}</div>
                </div>
                <h3 className="site-award-title">{a.title}</h3>
                <div className="site-award-org">{a.org}</div>
                <p className="site-award-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="site-section">
        <div className="site-container">
          <div className="site-section-header">
            <div className="site-section-badge">Compliance &amp; Certifications</div>
            <h2 className="site-section-title">Globally Certified, Locally Trusted</h2>
          </div>
          <div className="site-certs-grid">
            {certifications.map((c) => (
              <div key={c.name} className="site-cert-card">
                <div className="site-cert-check">✓</div>
                <h4 className="site-cert-name">{c.name}</h4>
                <p className="site-cert-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
