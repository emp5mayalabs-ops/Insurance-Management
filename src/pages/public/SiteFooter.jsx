import { Link } from 'react-router-dom';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          {/* Brand Col */}
          <div className="site-footer-col">
            <div className="site-footer-brand">
              <div className="site-brand-icon-sm">MC</div>
              <span>MASTERS COMPANION</span>
            </div>
            <p className="site-footer-desc">
              Protecting what matters most. Trusted by over 50,000 families across the country since
              1998.
            </p>
            <div className="site-footer-socials">
              <a href="#" aria-label="Facebook" className="social-link">f</a>
              <a href="#" aria-label="Twitter" className="social-link">t</a>
              <a href="#" aria-label="LinkedIn" className="social-link">in</a>
              <a href="#" aria-label="Instagram" className="social-link">ig</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="site-footer-col">
            <h4 className="site-footer-heading">Quick Links</h4>
            <ul className="site-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/achievements">Achievements</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="site-footer-col">
            <h4 className="site-footer-heading">Insurance Products</h4>
            <ul className="site-footer-links">
              <li><a href="#">Life Insurance</a></li>
              <li><a href="#">Health &amp; Medical</a></li>
              <li><a href="#">Motor Insurance</a></li>
              <li><a href="#">Home &amp; Property</a></li>
              <li><a href="#">Travel Insurance</a></li>
              <li><a href="#">Business Insurance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="site-footer-col">
            <h4 className="site-footer-heading">Contact Us</h4>
            <ul className="site-footer-contact">
              <li>
                <span>📍</span>
                <span>42, Masters Tower, MG Road, Bangalore – 560001</span>
              </li>
              <li>
                <span>📞</span>
                <span>1800-123-4567 (Toll Free)</span>
              </li>
              <li>
                <span>✉️</span>
                <span>support@masterscompanion.in</span>
              </li>
              <li>
                <span>🕐</span>
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {year} Masters Companion Insurance Pvt. Ltd. All rights reserved.</p>
          <div className="site-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Disclaimer</a>
            <a href="#">IRDAI Licence No. 124</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
