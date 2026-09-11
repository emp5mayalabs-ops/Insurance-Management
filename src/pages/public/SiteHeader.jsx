import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Achievements', to: '/achievements' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Brand */}
        <Link to="/" className="site-brand">
          <div className="site-brand-icon">MC</div>
          <div className="site-brand-text">
            <span className="site-brand-name">MASTERS COMPANION</span>
            <span className="site-brand-tagline">Insurance &amp; Financial Services</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="site-nav">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`site-nav-link${location.pathname === l.to ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="site-header-cta">
          <Link to="/login" className="site-login-btn">
            Login
          </Link>
          <Link to="/login" className="site-getquote-btn">
            Get a Quote
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="site-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="site-mobile-menu">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="site-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="site-login-btn" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
