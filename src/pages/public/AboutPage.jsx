import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="concierge-header-banner">
        <div className="container text-center">
          <span className="section-subtitle">THE STORY OF STAYEASE</span>
          <h1 className="concierge-page-title">Hospitality Rooted in Calm</h1>
          <p className="concierge-page-desc centered" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Born from a simple belief: vacation home rentals across India should feel tranquil, luxurious, and completely cared for.
          </p>
        </div>
      </div>

      <div className="container section-spacing" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>
              Why We Built StayEase
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Traveling to holiday rentals often forces guests to choose between two extremes: impersonal standardized hotels or charming homestays where you end up managing your own cooking, cleaning, taxi negotiations, and broken plumbing.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              StayEase is the harmonious middle ground. We curate the most architecturally soulful holiday homes across Goa, Pondicherry, Kerala, Coorg, Ooty, and Rajasthan — and empower them with a dedicated on-ground concierge network.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem',
              backgroundColor: 'var(--cream)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
                For Guests
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                A vacation where your desires are anticipated. Request private chefs, airport transfers, and local experiences in two taps.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
                For Property Owners
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                End-to-end property stewardship. Connect directly with vetted regional service providers and maximize guest delight without operational stress.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/explore">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Our Stays
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
