import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award, Phone, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const destinations = [
    'Goa',
    'Pondicherry',
    'Kerala Backwaters',
    'Coorg Hills',
    'Ooty & Nilgiris',
    'Jaipur',
    'Udaipur',
    'Manali Valleys'
  ];

  const conciergeList = [
    'Airport Transfers',
    'Private In-Villa Chefs',
    'Artisanal Breakfasts',
    'Pre-Arrival Groceries',
    'Daily Housekeeping',
    'Heritage & Boat Tours',
    'Bespoke Celebrations',
    'Rapid Maintenance'
  ];

  return (
    <footer className="stayease-footer">
      <div className="container footer-container">
        {/* Top Brand Section */}
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                <rect width="32" height="32" rx="8" fill="#ED7014" />
                <path d="M16 7 C10 14 9 21 16 26 C23 21 22 14 16 7 Z" fill="#FFFFFF" />
                <path d="M16 11 L16 23" stroke="#ED7014" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="footer-logo-title">StayEase</span>
            </div>
            <p className="footer-tagline">
              Stay somewhere beautiful.<br />We'll take care of the rest.
            </p>
            <p className="footer-subtext">
              Curated holiday rentals across India paired with intuitive, on-ground concierge care.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Destinations</h4>
            <ul className="footer-links-list">
              {destinations.map((d) => (
                <li key={d}>
                  <Link to={`/explore?destination=${encodeURIComponent(d)}`} className="footer-link">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Concierge Services</h4>
            <ul className="footer-links-list">
              {conciergeList.map((c) => (
                <li key={c}>
                  <Link to="/concierge" className="footer-link">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links-list">
              <li><Link to="/how-it-works" className="footer-link">How It Works</Link></li>
              <li><Link to="/explore" className="footer-link">Explore Stays</Link></li>
              <li><Link to="/about" className="footer-link">The StayEase Story</Link></li>
              <li><Link to="/guest/dashboard" className="footer-link">Guest Portal</Link></li>
              <li><Link to="/owner/dashboard" className="footer-link">Host Your Stay</Link></li>
              <li><Link to="/provider/dashboard" className="footer-link">Provider Network</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Assurance Badges */}
        <div className="footer-assurance-row">
          <div className="assurance-item">
            <Shield size={18} className="assurance-icon" />
            <div className="assurance-text">
              <strong>Verified Stays</strong>
              <span>Personally inspected for serene comfort</span>
            </div>
          </div>
          <div className="assurance-item">
            <Sparkles size={18} className="assurance-icon" />
            <div className="assurance-text">
              <strong>Dedicated Concierge</strong>
              <span>On-call local assistance throughout your stay</span>
            </div>
          </div>
          <div className="assurance-item">
            <Award size={18} className="assurance-icon" />
            <div className="assurance-text">
              <strong>Vetted Local Partners</strong>
              <span>Licensed drivers, trained chefs, & technicians</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom-row">
          <p className="footer-copy">
            © {new Date().getFullYear()} StayEase Hospitality India Pvt. Ltd. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>House Rules & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
